using System;
using Domain;
using AutoMapper;
using Application.Activities.DTOs;
using Application.Profiles.DTOs;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        string? currentUserId = null;
        CreateMap<Activity, Activity>();

        CreateMap<CreateActivityDto, Activity>();

        CreateMap<EditActivityDto, Activity>();

        CreateMap<Activity, ActivityDto>()
            .ForMember(dest => dest.HostDisplayName, opt => opt.MapFrom(src =>
                src.Attendees.FirstOrDefault(x => x.IsHost)!.User.DisplayName))
            .ForMember(dest => dest.HostId, opt => opt.MapFrom(src =>
                src.Attendees.FirstOrDefault(x => x.IsHost)!.UserId));

        CreateMap<ActivityAttendee, UserProfile>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.User.Id))
            .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.User.DisplayName))
            .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.User.Bio))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.User.ImageUrl))
            .ForMember(d => d.FollowersCount, opt => opt.MapFrom(src => src.User.Followers.Count))
            .ForMember(d => d.FollowingCount, opt => opt.MapFrom(src => src.User.Followings.Count))
            .ForMember(d => d.Following, opt => opt.MapFrom(src => src.User.Followers
                                                .Any(x => x.Observer.Id == currentUserId)));

        CreateMap<User, UserProfile>()
            .ForMember(d => d.FollowersCount, opt => opt.MapFrom(src => src.Followers.Count))
            .ForMember(d => d.FollowingCount, opt => opt.MapFrom(src => src.Followings.Count))
            .ForMember(d => d.Following, opt => opt.MapFrom(src => src.Followers
                                                .Any(x => x.Observer.Id == currentUserId)));

        CreateMap<Comment, CommentDto>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User.Id))
            .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.User.DisplayName))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src =>
                src.User.ImageUrl));
    }
}
