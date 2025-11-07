using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.WorkItems.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.WorkItems.Commands.UpdateWorkItem;

public class UpdateWorkItemHandler : IRequestHandler<UpdateWorkItemCommand, Result<WorkItemDto>>
{
    private readonly IRepository<WorkItem> _workItemRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Sprint> _sprintRepository;
    private readonly IRepository<ProjectMember> _projectMemberRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPermissionService _permissionService;

    public UpdateWorkItemHandler(
        IRepository<WorkItem> workItemRepository,
        IRepository<User> userRepository,
        IRepository<Sprint> sprintRepository,
        IRepository<ProjectMember> projectMemberRepository,
        ICurrentUserService currentUserService,
        IPermissionService permissionService)
    {
        _workItemRepository = workItemRepository;
        _userRepository = userRepository;
        _sprintRepository = sprintRepository;
        _projectMemberRepository = projectMemberRepository;
        _currentUserService = currentUserService;
        _permissionService = permissionService;
    }

    public async Task<Result<WorkItemDto>> Handle(UpdateWorkItemCommand request, CancellationToken cancellationToken)
    {
        var workItem = await _workItemRepository.GetByIdAsync(request.Id, cancellationToken);

        if (workItem == null)
        {
            return Result.Fail<WorkItemDto>("Work item not found");
        }

        var currentUserId = _currentUserService.GetCurrentUserId();
        if (currentUserId == null)
        {
            return Result.Fail<WorkItemDto>("User not authenticated");
        }

        // Check if user is a project member OR has admin permission
        var hasAdminPermission = await _permissionService.HasPermissionAsync(currentUserId.Value, "Admin.AccessAdminPanel");

        if (!hasAdminPermission)
        {
            var projectMembers = await _projectMemberRepository.GetAllAsync(cancellationToken);
            var isMember = projectMembers.Any(pm =>
                pm.ProjectId == workItem.ProjectId &&
                pm.UserId == currentUserId.Value &&
                !pm.IsDeleted);

            if (!isMember)
            {
                return Result.Fail<WorkItemDto>("You must be a project member to edit work items");
            }
        }

        // Validate assignee exists if provided
        if (request.AssigneeId.HasValue)
        {
            var assigneeExists = await _userRepository.ExistsAsync(request.AssigneeId.Value, cancellationToken);
            if (!assigneeExists)
            {
                return Result.Fail<WorkItemDto>("Assignee user not found");
            }
        }

        // Validate reporter exists if provided
        if (request.ReporterId.HasValue)
        {
            var reporterExists = await _userRepository.ExistsAsync(request.ReporterId.Value, cancellationToken);
            if (!reporterExists)
            {
                return Result.Fail<WorkItemDto>("Reporter user not found");
            }
        }

        // Validate sprint exists if provided
        if (request.SprintId.HasValue)
        {
            var sprintExists = await _sprintRepository.ExistsAsync(request.SprintId.Value, cancellationToken);
            if (!sprintExists)
            {
                return Result.Fail<WorkItemDto>("Sprint not found");
            }
        }

        // Update fields
        workItem.Title = request.Title;
        workItem.Description = request.Description;
        workItem.Status = request.Status;
        workItem.Priority = request.Priority;
        workItem.StoryPoints = request.StoryPoints;
        workItem.OriginalEstimateMinutes = request.OriginalEstimateMinutes;
        workItem.RemainingEstimateMinutes = request.RemainingEstimateMinutes;
        workItem.TimeLoggedMinutes = request.TimeLoggedMinutes;
        workItem.AssigneeId = request.AssigneeId;
        workItem.ReporterId = request.ReporterId;
        workItem.SprintId = request.SprintId;
        workItem.UpdatedAt = DateTime.UtcNow;

        await _workItemRepository.UpdateAsync(workItem, cancellationToken);

        // Map to DTO
        var dto = new WorkItemDto
        {
            Id = workItem.Id,
            Title = workItem.Title,
            Description = workItem.Description,
            Type = workItem.Type,
            Status = workItem.Status,
            Priority = workItem.Priority,
            StoryPoints = workItem.StoryPoints,
            OriginalEstimateMinutes = workItem.OriginalEstimateMinutes,
            RemainingEstimateMinutes = workItem.RemainingEstimateMinutes,
            TimeLoggedMinutes = workItem.TimeLoggedMinutes,
            ProjectId = workItem.ProjectId,
            AssigneeId = workItem.AssigneeId,
            ReporterId = workItem.ReporterId,
            ParentId = workItem.ParentId,
            SprintId = workItem.SprintId,
            CreatedAt = workItem.CreatedAt,
            UpdatedAt = workItem.UpdatedAt
        };

        return Result.Ok(dto);
    }
}
