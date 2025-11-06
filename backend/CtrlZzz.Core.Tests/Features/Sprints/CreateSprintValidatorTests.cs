using CtrlZzz.Core.Features.Sprints.Commands.CreateSprint;
using FluentValidation.TestHelper;
using Xunit;

namespace CtrlZzz.Core.Tests.Features.Sprints;

public class CreateSprintValidatorTests
{
    private readonly CreateSprintValidator _validator;

    public CreateSprintValidatorTests()
    {
        _validator = new CreateSprintValidator();
    }

    [Fact]
    public void Should_HaveError_When_NameIsEmpty()
    {
        var command = new CreateSprintCommand("", null, null, Guid.NewGuid());
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Should_HaveError_When_NameExceedsMaxLength()
    {
        var command = new CreateSprintCommand(new string('a', 201), null, null, Guid.NewGuid());
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Should_HaveError_When_ProjectIdIsEmpty()
    {
        var command = new CreateSprintCommand("Sprint 1", null, null, Guid.Empty);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.ProjectId);
    }

    [Fact]
    public void Should_NotHaveError_When_CommandIsValid()
    {
        var command = new CreateSprintCommand("Sprint 1", "Sprint Goal", DateTime.UtcNow.AddDays(14), Guid.NewGuid());
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }
}
