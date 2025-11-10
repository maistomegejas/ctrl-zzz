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
    private readonly Mock<IRepository<ProjectMember>> _projectMemberRepository;
    private readonly Mock<ICurrentUserService> _currentUserService;
    private readonly CreateProjectHandler _handler;

    public CreateProjectHandlerTests()
    {
        _projectRepository = new Mock<IRepository<Project>>();
        _projectMemberRepository = new Mock<IRepository<ProjectMember>>();
        _currentUserService = new Mock<ICurrentUserService>();
        _handler = new CreateProjectHandler(
            _projectRepository.Object,
            _projectMemberRepository.Object,
            _currentUserService.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldCreateProject()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var command = new CreateProjectCommand(
            Name: "Test Project",
            Key: "TEST",
            Description: "Test description"
        );

        _currentUserService.Setup(x => x.GetCurrentUserId()).Returns(userId);

        _projectRepository.Setup(x => x.AddAsync(It.IsAny<Project>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Project p, CancellationToken ct) => p);

        _projectMemberRepository.Setup(x => x.AddAsync(It.IsAny<ProjectMember>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((ProjectMember pm, CancellationToken ct) => pm);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        result.Value.Name.Should().Be("Test Project");
        result.Value.Key.Should().Be("TEST");
        result.Value.Description.Should().Be("Test description");
        result.Value.OwnerId.Should().Be(userId);

        _projectRepository.Verify(x => x.AddAsync(It.IsAny<Project>(), It.IsAny<CancellationToken>()), Times.Once);
        _projectMemberRepository.Verify(x => x.AddAsync(It.IsAny<ProjectMember>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_UserNotAuthenticated_ShouldReturnFailure()
    {
        // Arrange
        var command = new CreateProjectCommand(
            Name: "Test Project",
            Key: "TEST",
            Description: null
        );

        _currentUserService.Setup(x => x.GetCurrentUserId()).Returns((Guid?)null);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailed.Should().BeTrue();
        result.Errors.Should().Contain(e => e.Message == "User not authenticated");

        _projectRepository.Verify(x => x.AddAsync(It.IsAny<Project>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
