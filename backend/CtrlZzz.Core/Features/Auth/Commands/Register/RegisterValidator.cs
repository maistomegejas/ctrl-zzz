using FluentValidation;

namespace CtrlZzz.Core.Features.Auth.Commands.Register;

public class RegisterValidator : AbstractValidator<RegisterCommand>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(200).WithMessage("Name must not exceed 200 characters");

        // Lenient password requirements - just need to not be empty
        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required");
    }
}
