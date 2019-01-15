import { Client, ArmletAuthParams, ArmletData } from 'armlet';

/**
 * Creates new Armlet Client instance used to make analyze api call.
 *
 * @param auth {ArmletAuthParams} - Object which contains authentication parameters (apiKey, password, email, ethAddress).
 * @param platforms {Array<string>} - Array of platforms (e.g. truffle, vscode).
 * @returns new armlet Client instance.
 */
export const getClient = (auth: ArmletAuthParams, platforms: Array<string>): Client => {
  const { apiKey, password, ethAddress, email } = auth;
  const options: ArmletData = {
    platforms,
  };

  if (!apiKey && !password) {
    throw new Error('You need to set either apiKey or password to use MythX.');
  }

  if (apiKey) {
    options.apiKey = apiKey;
  } else {
    if (!ethAddress && !email) {
      throw new Error('You need to set either ethAddress or email to use MythX.');
    }
    if (ethAddress) {
      options.ethAddress = ethAddress;
    } else if (email) {
      options.email = email;
    }
    options.password = password;
  }

  return new Client(options);
};
