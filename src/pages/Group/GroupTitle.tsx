import { memo } from "react";
import { GroupIconContainer } from "./GroupIconContainer";
import type { GroupCompleteViewDto } from "../../api/types/group";

interface GroupTitleProps {
  group: GroupCompleteViewDto;
}

export const GroupTitle = memo(function GroupTitle({ group }: GroupTitleProps) {
  console.log(group);
  return (
    <div className="flex mb-6">
      <GroupIconContainer color={group.color} groupIconId={group.icon} />
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {group.name}
        </h1>
        {group.description && (
          <p className="text-muted-foreground text-lg">{group.description}</p>
        )}
      </div>
    </div>
  );
});
