using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Enums;
using CtrlZzz.Core.Features.WorkItems.Commands.CreateWorkItem;
using CtrlZzz.Core.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace CtrlZzz.Core.Tests.Features.WorkItems;

public class CreateWorkItemHandlerTests
{
    private readonly Mock<IRepository<WorkItem>> _workItemRepository;
    private readonly Mock<IRepository<Project>> _projectRepository;
    private readonly Mock<IRepository<User>> _userRepository;
    private readonly CreateWorkItemHandler _handler;

    public CreateWorkItemHandlerTests()
    {
        _workItemRepository = new Mock<IRepository<WorkItem>>();
        _projectRepository = new Mock<IRepository<Project>>();
        _userRepository = new Mock<IRepository<User>>();
        _handler = new CreateWorkItemHandler(_workItemRepository.Object, _projectRepository.Object, _userRepository.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldCreateWorkItem()
    {
        // Arrange
        var projectId = Guid.NewGuid();
        var command = new CreateWorkItemCommand(
            Title: "Test Work Item",
            Description: "Test description",
            Type: WorkItemType.Task,
            Priority: Priority.Medium,
            StoryPoints: 3,
            ProjectId: projectId,
            AssigneeId: null,
            ParentId: null
        );

        _projectRepository.Setup(x => x.ExistsAsync(projectId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        _workItemRepository.Setup(x => x.AddAsync(It.IsAny<WorkItem>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((WorkItem w, CancellationToken ct) => w);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        result.Value.Title.Should().Be("Test Work Item");
        result.Value.Type.Should().Be(WorkItemType.Task);
        result.Value.Priority.Should().Be(Priority.Medium);
        result.Value.Status.Should().Be(WorkItemStatus.ToDo);

        _workItemRepository.Verify(x => x.AddAsync(It.IsAny<WorkItem>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ProjectNotFound_ShouldReturnFailure()
    {
        // Arrange
        var projectId = Guid.NewGuid();
        var command = new CreateWorkItemCommand(
            Title: "Test Work Item",
            Description: null,
            Type: WorkItemType.Task,
            Priority: Priority.Medium,
            StoryPoints: null,
            ProjectId: projectId,
            AssigneeId: null,
            ParentId: null
        );

        _projectRepository.Setup(x => x.ExistsAsync(projectId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailed.Should().BeTrue();
        result.Errors.Should().Contain(e => e.Message == "Project not found");

        _workItemRepository.Verify(x => x.AddAsync(It.IsAny<WorkItem>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
