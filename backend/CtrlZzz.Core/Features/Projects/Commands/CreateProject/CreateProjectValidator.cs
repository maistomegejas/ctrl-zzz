using FluentValidation;

namespace CtrlZzz.Core.Features.Projects.Commands.CreateProject;

public class CreateProjectValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Project name is required")
            .MaximumLength(200).WithMessage("Project name cannot exceed 200 characters");

        RuleFor(x => x.Key)
            .NotEmpty().WithMessage("Project key is required")
            .MaximumLength(10).WithMessage("Project key cannot exceed 10 characters")
            .Matches("^[A-Z]+$").WithMessage("Project key must be uppercase letters only");

        RuleFor(x => x.OwnerId)
            .NotEmpty().WithMessage("Owner is required");
    }
}
