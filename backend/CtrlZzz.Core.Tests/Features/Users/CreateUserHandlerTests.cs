using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Users.Commands.CreateUser;
using CtrlZzz.Core.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace CtrlZzz.Core.Tests.Features.Users;

public class CreateUserHandlerTests
{
    private readonly Mock<IRepository<User>> _userRepository;
    private readonly CreateUserHandler _handler;

    public CreateUserHandlerTests()
    {
        _userRepository = new Mock<IRepository<User>>();
        _handler = new CreateUserHandler(_userRepository.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldCreateUser()
    {
        // Arrange
        var command = new CreateUserCommand(
            Email: "test@example.com",
            Name: "Test User",
            Password: "password123"
        );

        _userRepository.Setup(x => x.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((User u, CancellationToken ct) => u);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        result.Value.Email.Should().Be("test@example.com");
        result.Value.Name.Should().Be("Test User");

        _userRepository.Verify(x => x.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}
