using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Projects.Commands.CreateProject;
using CtrlZzz.Core.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace CtrlZzz.Core.Tests.Features.Projects;

public class CreateProjectHandlerTests
{
    private readonly Mock<IRepository<Project>> _projectRepository;
    private readonly Mock<IRepository<User>> _userRepository;
    private readonly CreateProjectHandler _handler;

    public CreateProjectHandlerTests()
    {
        _projectRepository = new Mock<IRepository<Project>>();
        _userRepository = new Mock<IRepository<User>>();
        _handler = new CreateProjectHandler(_projectRepository.Object, _userRepository.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldCreateProject()
    {
        // Arrange
        var ownerId = Guid.NewGuid();
        var command = new CreateProjectCommand(
            Name: "Test Project",
            Key: "TEST",
            Description: "Test description",
            OwnerId: ownerId
        );

        _userRepository.Setup(x => x.ExistsAsync(ownerId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        _projectRepository.Setup(x => x.AddAsync(It.IsAny<Project>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Project p, CancellationToken ct) => p);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        result.Value.Name.Should().Be("Test Project");
        result.Value.Key.Should().Be("TEST");
        result.Value.Description.Should().Be("Test description");
        result.Value.OwnerId.Should().Be(ownerId);

        _projectRepository.Verify(x => x.AddAsync(It.IsAny<Project>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_OwnerNotFound_ShouldReturnFailure()
    {
        // Arrange
        var ownerId = Guid.NewGuid();
        var command = new CreateProjectCommand(
            Name: "Test Project",
            Key: "TEST",
            Description: null,
            OwnerId: ownerId
        );

        _userRepository.Setup(x => x.ExistsAsync(ownerId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailed.Should().BeTrue();
        result.Errors.Should().Contain(e => e.Message == "Owner user not found");

        _projectRepository.Verify(x => x.AddAsync(It.IsAny<Project>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
