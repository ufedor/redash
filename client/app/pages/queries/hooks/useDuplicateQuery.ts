import { noop, extend, pick } from "lodash";
import { useCallback, useState } from "react";
import url from "url";
import qs from "query-string";
import { Query } from "@/services/query";

function keepCurrentUrlParams(targetUrl: any) {
  const currentUrlParams = qs.parse(window.location.search);
  targetUrl = url.parse(targetUrl);
  const targetUrlParams = qs.parse(targetUrl.search);
  return url.format(
    extend(pick(targetUrl, ["protocol", "auth", "host", "pathname", "hash"]), {
      search: qs.stringify(extend(currentUrlParams, targetUrlParams)),
    })
  );
}

export default function useDuplicateQuery(query: any) {
  const [isDuplicating, setIsDuplicating] = useState(false);

  const duplicateQuery = useCallback(() => {
    // To prevent opening the same tab, name must be unique for each browser
    const tabName = `duplicatedQueryTab/${Math.random().toString()}`;

    // We should open tab here because this moment is a part of user interaction;
    // later browser will block such attempts
    const tab = window.open("", tabName);

    setIsDuplicating(true);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'fork' does not exist on type 'typeof Que... Remove this comment to see the full error message
    Query.fork({ id: query.id })
      .then((newQuery: any) => {
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        tab.location = keepCurrentUrlParams(newQuery.getUrl(true));
      })
      .finally(() => {
        setIsDuplicating(false);
      });
  }, [query.id]);

  return [isDuplicating, isDuplicating ? noop : duplicateQuery];
}
