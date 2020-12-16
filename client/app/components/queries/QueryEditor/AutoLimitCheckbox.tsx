import React, { useCallback } from "react";
import recordEvent from "@/services/recordEvent";
import Checkbox from "antd/lib/checkbox";
import Tooltip from "antd/lib/tooltip";

type Props = {
    available?: boolean;
    checked: boolean;
    onChange: (...args: any[]) => any;
};

export default function AutoLimitCheckbox({ available, checked, onChange }: Props) {
  const handleClick = useCallback(() => {
    recordEvent("checkbox_auto_limit", "screen", "query_editor", { state: !checked });
    onChange(!checked);
  }, [checked, onChange]);

  let tooltipMessage = null;
  if (!available) {
    tooltipMessage = "Auto limiting is not available for this Data Source type.";
  } else {
    tooltipMessage = "Auto limit results to first 1000 rows.";
  }

  return (
    <Tooltip placement="top" title={tooltipMessage}>
      <Checkbox
        className="query-editor-controls-checkbox"
        disabled={!available}
        onClick={handleClick}
        checked={available && checked}>
        LIMIT 1000
      </Checkbox>
    </Tooltip>
  );
}
