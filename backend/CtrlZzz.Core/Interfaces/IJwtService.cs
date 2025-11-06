using CtrlZzz.Core.Entities;

namespace CtrlZzz.Core.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
    string GenerateRefreshToken();
}
