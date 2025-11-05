using FluentValidation;

namespace CtrlZzz.Core.Features.Users.Commands.UpdateUser;

public class UpdateUserValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("User ID is required");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(200).WithMessage("Name cannot exceed 200 characters");

        RuleFor(x => x.Password)
            .MinimumLength(6).WithMessage("Password must be at least 6 characters")
            .When(x => !string.IsNullOrEmpty(x.Password));
    }
}
