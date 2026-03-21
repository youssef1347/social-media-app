

export const getMutual = (currentUser, targetUser) => {
    const currentUserFollowing = currentUser.following;
    const targetUserFollowing = targetUser.following;
    const mutualFriends = currentUserFollowing.filter(friend => targetUserFollowing.includes(friend));
    return mutualFriends;
}