namespace CtrlZzz.Core.Interfaces;

public interface ICurrentUserService
{
    Guid? GetCurrentUserId();
    string? GetCurrentUserEmail();
}
