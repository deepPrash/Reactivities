using System;
using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

public class GetFollowings
{
    public class Query : IRequest<Result<List<UserProfile>>>
    {
        public required string UserId { get; set; }
        public required string Predicate { get; set; } = "followers"; // Default to "followers", can be "following" as well
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor)
        : IRequestHandler<Query, Result<List<UserProfile>>>
    {

        public async Task<Result<List<UserProfile>>> Handle(Query request, CancellationToken cancellationToken)
        {
            // Implementation to get followings based on the predicate (followers or following)
            // This is a placeholder and should be replaced with actual logic to retrieve data from the database
            var profiles = new List<UserProfile>(); // Replace with actual retrieval logic

            switch (request.Predicate.ToLower())
            {
                case "followers":
                    // Retrieve followers of the user
                    profiles = await context.UserFollowings
                        .Where(x => x.TargetId == request.UserId)
                        .Select(x => x.Observer)
                        .ProjectTo<UserProfile>(mapper.ConfigurationProvider,
                            new { currentUserId = userAccessor.GetUserId() })
                        .ToListAsync(cancellationToken);
                    break;
                case "followings":
                    // Retrieve users that the user is following
                    profiles = await context.UserFollowings
                        .Where(x => x.ObserverId == request.UserId)
                        .Select(x => x.Target)
                        .ProjectTo<UserProfile>(mapper.ConfigurationProvider,
                            new { currentUserId = userAccessor.GetUserId() })
                        .ToListAsync(cancellationToken);
                    break;
                default:
                    return Result<List<UserProfile>>.Failure("Invalid predicate", 400);
            }

            return Result<List<UserProfile>>.Success(profiles);
        }
    }
}
