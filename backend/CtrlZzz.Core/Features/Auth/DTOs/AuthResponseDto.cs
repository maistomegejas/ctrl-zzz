using CtrlZzz.Core.Features.Users.DTOs;

namespace CtrlZzz.Core.Features.Auth.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}
