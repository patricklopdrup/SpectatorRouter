namespace SpectatorRouter.Server.Models;

public class RoutePointDto
{
    public double Lat { get; set; }
    public double Lng { get; set; }
    public DateTime TimeUtc { get; set; }
    // optional: distance along route in meters
    public double DistanceMeters { get; set; }
}
