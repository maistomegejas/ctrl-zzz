using CtrlZzz.Core.Enums;
using CtrlZzz.Core.Features.WorkItems.Commands.CreateWorkItem;
using FluentAssertions;
using Xunit;

namespace CtrlZzz.Core.Tests.Features.WorkItems;

public class CreateWorkItemValidatorTests
{
    private readonly CreateWorkItemValidator _validator = new();

    [Fact]
    public void Validate_ValidCommand_ShouldPass()
    {
        // Arrange
        var command = new CreateWorkItemCommand(
            Title: "Test Work Item",
            Description: "Test description",
            Type: WorkItemType.Task,
            Priority: Priority.Medium,
            StoryPoints: 3,
            ProjectId: Guid.NewGuid(),
            AssigneeId: Guid.NewGuid(),
            ParentId: null
        );

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_EmptyTitle_ShouldFail()
    {
        // Arrange
        var command = new CreateWorkItemCommand(
            Title: "",
            Description: null,
            Type: WorkItemType.Task,
            Priority: Priority.Medium,
            StoryPoints: null,
            ProjectId: Guid.NewGuid(),
            AssigneeId: null,
            ParentId: null
        );

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Title");
    }

    [Fact]
    public void Validate_EmptyProjectId_ShouldFail()
    {
        // Arrange
        var command = new CreateWorkItemCommand(
            Title: "Test Work Item",
            Description: null,
            Type: WorkItemType.Task,
            Priority: Priority.Medium,
            StoryPoints: null,
            ProjectId: Guid.Empty,
            AssigneeId: null,
            ParentId: null
        );

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "ProjectId");
    }

    [Fact]
    public void Validate_NegativeStoryPoints_ShouldFail()
    {
        // Arrange
        var command = new CreateWorkItemCommand(
            Title: "Test Work Item",
            Description: null,
            Type: WorkItemType.Task,
            Priority: Priority.Medium,
            StoryPoints: -1,
            ProjectId: Guid.NewGuid(),
            AssigneeId: null,
            ParentId: null
        );

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "StoryPoints");
    }
}
