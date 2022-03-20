import { getSafeInfo as fetchSafeInfo, SafeInfo } from '@gnosis.pm/safe-react-gateway-sdk'

import { Errors, CodedException } from 'src/logic/exceptions/CodedException'
import { _getChainId } from 'src/config'
import { GATEWAY_URL } from 'src/utils/constants'
import axios from 'axios'

const GATEWAY_ERROR = /1337|42/

export const getSafeInfo = async (safeAddress: string): Promise<SafeInfo> => {
  try {
    console.log('getSafeInfo', safeAddress, _getChainId())
    if (_getChainId() === '1666600000') {
      console.log('here')
      const response = await axios.get(
        'https://multisig.t.hmny.io/api/v1/safes/0x7689573A24F5c1cbb4DCabbcE591Ba4D9bad6a12/',
      )
      // map this to the onne below:
      // {"address":"0x7689573A24F5c1cbb4DCabbcE591Ba4D9bad6a12","nonce":4,"threshold":2,"owners":["0x028CC8E3Ff248Dc59052eaAD2a1e749F3B835B99","0xB1e6c73EA591C3d1cE112f428B33850E7158fe22","0x515F09350a1fe52F4eCc000A5Ff3819cDa306a9C","0xc55A52479efe7e84D6Ad3C851Efd80b924347c98"],"masterCopy":"0x3736aC8400751bf07c6A2E4db3F4f3D9D422abB2","modules":[],"fallbackHandler":"0xC5d654bcE1220241FCe1f0F1D6b9E04f75175452","version":"1.2.0"}
      // {"address":{"value":"0x4214F98acf4c345379F28E970311Dc93Cc2f69E5"},"chainId":"137","nonce":0,"threshold":1,"owners":[{"value":"0x028CC8E3Ff248Dc59052eaAD2a1e749F3B835B99"},{"value":"0xB1e6c73EA591C3d1cE112f428B33850E7158fe22"}],"implementation":{"value":"0x3E5c63644E683549055b9Be8653de26E0B4CD36E","name":"Gnosis Safe: Singleton L2 1.3.0","logoUri":"http://staging-polygon-safe-transaction-web.safe.svc.cluster.local/media/contracts/logos/0x3E5c63644E683549055b9Be8653de26E0B4CD36E.png"},"modules":null,"fallbackHandler":{"value":"0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4","name":"Gnosis Safe: CompatibilityFallbackHandler 1.3.0","logoUri":"http://staging-polygon-safe-transaction-web.safe.svc.cluster.local/media/contracts/logos/0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4.png"},"guard":null,"version":"1.3.0","implementationVersionState":"UP_TO_DATE","collectiblesTag":"1647740443","txQueuedTag":"1647740443","txHistoryTag":"1647740443"}
      return {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        address: {
          value: response.data.address,
        },
        nonce: response.data.nonce,
        threshold: response.data.threshold,
        owners: response.data.owners.map((owner) => {
          return { value: owner }
        }),
      }
      //
    } else {
      return await fetchSafeInfo(GATEWAY_URL, _getChainId(), safeAddress)
    }
  } catch (e) {
    const safeNotFound = GATEWAY_ERROR.test(e.message)
    throw new CodedException(safeNotFound ? Errors._605 : Errors._613, e.message)
  }
}
