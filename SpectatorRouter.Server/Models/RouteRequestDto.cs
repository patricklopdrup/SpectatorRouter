using System.ComponentModel.DataAnnotations;

namespace SpectatorRouter.Server.Models;

public class LatLngDto
{
    [Required]
    public double Lat { get; set; }
    [Required]
    public double Lng { get; set; }
}

public class RouteRequestDto
{
    /// <summary>
    /// Ordered polyline the spectator will follow (array of lat/lng vertices)
    /// </summary>
    [Required]
    public List<LatLngDto> Path { get; set; } = new();

    /// <summary>
    /// Movement speed in meters per second OR specify unit in UI. (e.g. 3 m/s = ~10.8 km/h)
    /// </summary>
    [Range(0.1, 15)]
    public double SpeedMetersPerSecond { get; set; }

    /// <summary>
    /// Start time in ISO 8601 (UTC recommended)
    /// </summary>
    [Required]
    public DateTime StartTimeUtc { get; set; }

    /// <summary>
    /// Sampling interval in seconds for produced spots (default: 60 = every minute)
    /// </summary>
    [Range(1, 3600)]
    public int SampleIntervalSeconds { get; set; } = 60;
}
