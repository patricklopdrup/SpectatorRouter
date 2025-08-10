using Microsoft.AspNetCore.Mvc;
using SpectatorRouter.Server.Models;
using SpectatorRouter.Server.Services;

namespace SpectatorRouter.Server.Controllers;

public class RoutesController : ControllerBase
{
    private readonly IRouteService _routeService;
    private readonly ILogger<RoutesController> _logger;

    public RoutesController(IRouteService routeService, ILogger<RoutesController> logger)
    {
        _routeService = routeService;
        _logger = logger;
    }

    [HttpPost("compute")]
    public async Task<IActionResult> Compute([FromBody] RouteRequestDto request, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _routeService.ComputeRouteAsync(request, ct);
        return Ok(result);
    }
}
