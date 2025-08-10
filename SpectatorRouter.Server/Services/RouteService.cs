using SpectatorRouter.Server.Models;
using SpectatorRouter.Server.Utilities;

namespace SpectatorRouter.Server.Services;

public class RouteService : IRouteService
{
    public Task<List<RoutePointDto>> ComputeRouteAsync(RouteRequestDto request, CancellationToken ct = default)
    {
        // validation
        if (request.Path == null || request.Path.Count < 2)
            throw new ArgumentException("Path must contain at least two points.");

        var samples = new List<RoutePointDto>();

        // build segment distances
        var segments = new List<(LatLngDto A, LatLngDto B, double Distance)>();
        for (int i = 0; i < request.Path.Count - 1; i++)
        {
            var a = request.Path[i];
            var b = request.Path[i + 1];
            var d = GeoUtils.DistanceMeters(a.Lat, a.Lng, b.Lat, b.Lng);
            segments.Add((a, b, d));
        }

        // total length
        var total = segments.Sum(s => s.Distance);
        if (total <= 0)
            return Task.FromResult(samples);

        // sample along route every request.SampleIntervalSeconds
        var interval = TimeSpan.FromSeconds(request.SampleIntervalSeconds);
        var curTime = request.StartTimeUtc;
        var speed = request.SpeedMetersPerSecond;
        if (speed <= 0) speed = 1.0; // fallback

        var totalSeconds = total / speed;
        var numSamples = (int)Math.Ceiling(totalSeconds / interval.TotalSeconds) + 1;

        double travelled = 0.0; // meters from start

        for (int i = 0; i < numSamples; i++)
        {
            var tSeconds = i * interval.TotalSeconds;
            travelled = tSeconds * speed;
            if (travelled > total) travelled = total;

            // find segment
            double acc = 0;
            LatLngDto chosenA = segments[0].A;
            LatLngDto chosenB = segments[0].B;
            double segDist = segments[0].Distance;
            foreach (var seg in segments)
            {
                if (acc + seg.Distance >= travelled)
                {
                    chosenA = seg.A; chosenB = seg.B; segDist = seg.Distance;
                    break;
                }
                acc += seg.Distance;
            }

            var alongSegment = segDist <= 0 ? 0.0 : (travelled - acc) / segDist;
            var lat = GeoUtils.Lerp(chosenA.Lat, chosenB.Lat, alongSegment);
            var lng = GeoUtils.Lerp(chosenA.Lng, chosenB.Lng, alongSegment);

            samples.Add(new RoutePointDto
            {
                Lat = lat,
                Lng = lng,
                TimeUtc = request.StartTimeUtc.AddSeconds(tSeconds),
                DistanceMeters = travelled
            });

            if (travelled >= total) break; // reached end
        }

        return Task.FromResult(samples);
    }
}
