import {
  Environment,
  EnvironmentSettingsObject,
} from "../html/web_application_apis/scripting.ts";

export class RequestInternals {
  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-reserved-client)
   */
  reservedClient: Environment | EnvironmentSettingsObject | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-replaces-client-id)
   */
  replacesClientId = "";
}
