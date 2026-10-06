import { tokenConfig } from '../config/token.ts';
import { CopyAddressButton } from '../components/ContractPanel.tsx';
import { buildTokenView } from '../lib/view.ts';

export function Tokenomics() {
  const view = buildTokenView();
  const address = view.contract.copyEnabled ? view.contract.address : null;

  return (
    <section className="section section--ink" id="tokenomics" aria-labelledby="token-title">
      <div className="wrap">
        <p className="eyebrow">Tokenomics</p>
        <h2 id="token-title">TOKENOMICS</h2>
        <div className="paper-sheet">
          <table className="fact-table">
            <caption className="visually-hidden">Tokenomics for Night Watch Dog ($NWDOG)</caption>
            <tbody>
              <tr>
                <th scope="row">Contract address</th>
                <td>
                  <span className="token-address">
                    {address ? <span className="address">{address}</span> : <span>Coming Soon..</span>}
                    <CopyAddressButton address={address} />
                  </span>
                </td>
              </tr>
              <tr>
                <th scope="row">Total supply</th>
                <td>{tokenConfig.totalSupply ?? 'Not published'}</td>
              </tr>
              <tr>
                <th scope="row">Buy tax</th>
                <td>{view.buyTaxLabel}</td>
              </tr>
              <tr>
                <th scope="row">Sell tax</th>
                <td>{view.sellTaxLabel}</td>
              </tr>
              <tr>
                <th scope="row">Ownership</th>
                <td>{tokenConfig.ownershipDescription ?? 'Not published'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
