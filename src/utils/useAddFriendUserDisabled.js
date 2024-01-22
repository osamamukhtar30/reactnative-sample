import {useSelector} from 'react-redux';
import {selectAllFriends} from '@duelme/apisdk/dist/slices/friends/selectors';
import {selectSentRequests} from '@duelme/apisdk/dist/slices/friendships/selectors';

const useAddFriendUserDisabled = ({user}) => {
  let disabled = false;
  const friends = useSelector(selectAllFriends);
  if (friends.map(friend => friend.id).includes(user.id)) {
    disabled = true;
  }
  const friendRequests = useSelector(selectSentRequests);
  const requestedFriendIds = friendRequests.map(request => request.userIdTo);
  if (requestedFriendIds.includes(user.id)) {
    disabled = true;
  }
  return disabled;
};

export default useAddFriendUserDisabled;
