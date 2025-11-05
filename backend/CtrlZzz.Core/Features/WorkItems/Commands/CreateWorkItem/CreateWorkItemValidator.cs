using FluentValidation;

namespace CtrlZzz.Core.Features.WorkItems.Commands.CreateWorkItem;

public class CreateWorkItemValidator : AbstractValidator<CreateWorkItemCommand>
{
    public CreateWorkItemValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(500).WithMessage("Title cannot exceed 500 characters");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid work item type");

        RuleFor(x => x.Priority)
            .IsInEnum().WithMessage("Invalid priority");

        RuleFor(x => x.ProjectId)
            .NotEmpty().WithMessage("Project is required");

        RuleFor(x => x.StoryPoints)
            .GreaterThanOrEqualTo(0).WithMessage("Story points must be non-negative")
            .When(x => x.StoryPoints.HasValue);
    }
}
