using CtrlZzz.Core.Features.Projects.Commands.CreateProject;
using FluentAssertions;
using Xunit;

namespace CtrlZzz.Core.Tests.Features.Projects;

public class CreateProjectValidatorTests
{
    private readonly CreateProjectValidator _validator = new();

    [Fact]
    public void Validate_ValidCommand_ShouldPass()
    {
        // Arrange
        var command = new CreateProjectCommand(
            Name: "Test Project",
            Key: "TEST",
            Description: "Test description",
            OwnerId: Guid.NewGuid()
        );

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_EmptyName_ShouldFail()
    {
        // Arrange
        var command = new CreateProjectCommand(
            Name: "",
            Key: "TEST",
            Description: null,
            OwnerId: Guid.NewGuid()
        );

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Fact]
    public void Validate_EmptyKey_ShouldFail()
    {
        // Arrange
        var command = new CreateProjectCommand(
            Name: "Test Project",
            Key: "",
            Description: null,
            OwnerId: Guid.NewGuid()
        );

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Key");
    }

    [Fact]
    public void Validate_LowercaseKey_ShouldFail()
    {
        // Arrange
        var command = new CreateProjectCommand(
            Name: "Test Project",
            Key: "test",
            Description: null,
            OwnerId: Guid.NewGuid()
        );

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Key");
    }

    [Fact]
    public void Validate_EmptyOwnerId_ShouldFail()
    {
        // Arrange
        var command = new CreateProjectCommand(
            Name: "Test Project",
            Key: "TEST",
            Description: null,
            OwnerId: Guid.Empty
        );

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "OwnerId");
    }
}
