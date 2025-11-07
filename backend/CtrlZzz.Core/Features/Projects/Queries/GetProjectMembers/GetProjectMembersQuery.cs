using CtrlZzz.Core.Features.Projects.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Queries.GetProjectMembers;

public record GetProjectMembersQuery(Guid ProjectId) : IRequest<Result<List<ProjectMemberDto>>>;
