import { DISCLOSURE, RISK } from '../config/content.ts';
import { buildTokenView } from '../lib/view.ts';
import { TextLink } from '../components/TextLink.tsx';

export function Faq() {
  const view = buildTokenView();
  const audit = view.evidence.find((item) => item.id === 'audit');
  return (
    <section className="section section--ink" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq-wrap">
        <p className="eyebrow">FAQ</p>
        <h2 id="faq-title">QUESTIONS FROM THE GATE.</h2>
        <div className="faq-list">
          <details>
            <summary>What is NWDOG?</summary>
            <p>
              Night Watch Dog ($NWDOG) is an independent Ethereum meme project about a fictional Shiba who appointed
              himself safety officer of the robotaxi future. The theme is a joke and a pile of art. It does not run
              vehicles or safety systems.
            </p>
          </details>
          <details>
            <summary>Is it affiliated with Elon or Tesla?</summary>
            <p>{DISCLOSURE}</p>
          </details>
          <details>
            <summary>Which network?</summary>
            <p>
              Ethereum mainnet, chain ID 1. {view.chainProblem ?? 'The configured chain ID is 1.'} This website does
              not deploy a token.
            </p>
          </details>
          <details>
            <summary>Where is the official contract?</summary>
            {view.contract.address ? (
              <p>
                The configured address is <span className="address">{view.contract.address}</span>. Match that full
                address on the swap page. An address that merely looks valid is not proof the token is authentic.
                {view.contract.etherscanUrl ? (
                  <>
                    {' '}
                    <TextLink href={view.contract.etherscanUrl} external>
                      Etherscan
                    </TextLink>
                  </>
                ) : null}
              </p>
            ) : (
              <p>{view.contract.message} This site will not show a sample address.</p>
            )}
          </details>
          <details>
            <summary>How can I buy?</summary>
            {view.purchaseEnabled ? (
              <p>
                Use the official Uniswap page linked as Buy $NWDOG, then review the quote in your own wallet.{' '}
                <TextLink href={view.primaryCta.href} external>
                  Uniswap
                </TextLink>{' '}
                This website does not connect a wallet or send the transaction.
              </p>
            ) : (
              <p>
                You cannot buy $NWDOG from this site right now. The How to Buy section explains the later route: a
                wallet, ETH on Ethereum mainnet, the official Uniswap page, and a careful read of the quote. No swap is
                embedded here.
              </p>
            )}
          </details>
          <details>
            <summary>What are token taxes?</summary>
            <p>
              Buy tax: {view.buyTaxLabel}. Sell tax: {view.sellTaxLabel}. If a tax says “Not published,” that does not
              mean it is zero.
            </p>
          </details>
          <details>
            <summary>Is it audited?</summary>
            <p>
              {audit?.state === 'Evidence linked'
                ? 'An audit link has been published. This site has not independently checked it.'
                : 'An audit report has not been published. This site has not independently checked the contract.'}{' '}
              {audit?.href ? (
                <TextLink href={audit.href} external>
                  Audit report
                </TextLink>
              ) : null}
            </p>
          </details>
          <details>
            <summary>What are the risks?</summary>
            <p>
              {RISK} The dog, the vest, and the night shift are fictional. Prices can move before a swap confirms, fees
              can be high, and a contract can change if control has not been given up. Read the verification section
              and decide for yourself. Nothing on this site is financial, legal, or safety advice.
            </p>
          </details>
          <details>
            <summary>Can I join without purchasing?</summary>
            <p>
              Yes. You can read the story, make a fan badge, and download the artwork without buying, holding, or
              connecting a wallet.
              {view.socials.length === 0
                ? ' Official social channels are not published yet.'
                : ' Official channels are listed in the community section.'}
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
