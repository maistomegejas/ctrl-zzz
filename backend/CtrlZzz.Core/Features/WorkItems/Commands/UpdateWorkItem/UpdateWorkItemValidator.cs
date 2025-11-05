using FluentValidation;

namespace CtrlZzz.Core.Features.WorkItems.Commands.UpdateWorkItem;

public class UpdateWorkItemValidator : AbstractValidator<UpdateWorkItemCommand>
{
    public UpdateWorkItemValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Work item ID is required");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(500).WithMessage("Title cannot exceed 500 characters");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid status");

        RuleFor(x => x.Priority)
            .IsInEnum().WithMessage("Invalid priority");

        RuleFor(x => x.StoryPoints)
            .GreaterThanOrEqualTo(0).WithMessage("Story points must be non-negative")
            .When(x => x.StoryPoints.HasValue);
    }
}
