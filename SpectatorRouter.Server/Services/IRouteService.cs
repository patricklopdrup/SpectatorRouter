using SpectatorRouter.Server.Models;

namespace SpectatorRouter.Server.Services;

public interface IRouteService
{
    /// <summary>
    /// Compute sampled positions along an ordered polyline starting at StartTime and moving at given speed.
    /// </summary>
    Task<List<RoutePointDto>> ComputeRouteAsync(RouteRequestDto request, CancellationToken ct = default);
}
