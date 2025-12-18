import {apiFetch} from "@/lib/apiFetch";
import ClientGroups from "@/components/pages/ClientGroups";

const GroupsPage = async () => {
  const groups = await apiFetch("GET", "users/group/get");

  return (
    <>
      <ClientGroups groups={groups} />
    </>
  );
};

export default GroupsPage;