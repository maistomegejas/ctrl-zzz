using FluentValidation;

namespace CtrlZzz.Core.Features.Sprints.Commands.CreateSprint;

public class CreateSprintValidator : AbstractValidator<CreateSprintCommand>
{
    public CreateSprintValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Sprint name is required")
            .MaximumLength(200).WithMessage("Sprint name cannot exceed 200 characters");

        RuleFor(x => x.ProjectId)
            .NotEmpty().WithMessage("Project ID is required");

        RuleFor(x => x.EndDate)
            .Must(date => !date.HasValue || date.Value > DateTime.UtcNow)
            .When(x => x.EndDate.HasValue)
            .WithMessage("End date must be in the future");
    }
}
