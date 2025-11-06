using CtrlZzz.Core.Features.Users.Commands.CreateUser;
using FluentAssertions;
using Xunit;

namespace CtrlZzz.Core.Tests.Features.Users;

public class CreateUserValidatorTests
{
    private readonly CreateUserValidator _validator = new();

    [Fact]
    public void Validate_ValidCommand_ShouldPass()
    {
        // Arrange
        var command = new CreateUserCommand(
            Email: "test@example.com",
            Name: "Test User",
            Password: "password123"
        );

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_EmptyEmail_ShouldFail()
    {
        // Arrange
        var command = new CreateUserCommand(
            Email: "",
            Name: "Test User",
            Password: "password123"
        );

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Email");
    }

    [Fact]
    public void Validate_InvalidEmailFormat_ShouldFail()
    {
        // Arrange
        var command = new CreateUserCommand(
            Email: "notanemail",
            Name: "Test User",
            Password: "password123"
        );

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Email");
    }

    [Fact]
    public void Validate_EmptyName_ShouldFail()
    {
        // Arrange
        var command = new CreateUserCommand(
            Email: "test@example.com",
            Name: "",
            Password: "password123"
        );

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Fact]
    public void Validate_ShortPassword_ShouldFail()
    {
        // Arrange
        var command = new CreateUserCommand(
            Email: "test@example.com",
            Name: "Test User",
            Password: "123"
        );

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Password");
    }
}
