import { useSelector } from "react-redux";
import { getUser, getCurrentUser } from "redux/selectors/usersSelectors";
import { getSubscriptions } from 'redux/selectors/subscriptionSelectors';

export const useUserDetails = () => {
  const user = useSelector(getUser);
  const currentUser = useSelector(getCurrentUser);
  const orgID = user.currentOrgId;
  const orgName = user.orgs.find(org => org.id === orgID)?.name || "";
  const domain = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
  const subscriptions = useSelector(getSubscriptions);

  return {
    orgID,
    orgName,
    currentUser,
    domain,
    subscriptions
  };
};