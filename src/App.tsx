import { Footer } from './components/Footer.tsx';
import { Header } from './components/Header.tsx';
import { MenuProvider } from './components/MenuContext.tsx';
import { useMenu } from './components/menuState.ts';
import { MobileBar } from './components/MobileBar.tsx';
import { NightVisionProvider } from './components/NightVision.tsx';
import { SkipLink } from './components/SkipLink.tsx';
import { Community } from './sections/Community.tsx';
import { Hero } from './sections/Hero.tsx';
import { HowToBuy } from './sections/HowToBuy.tsx';
import { Invitation } from './sections/Invitation.tsx';
import { Story } from './sections/Story.tsx';
import { Tokenomics } from './sections/Tokenomics.tsx';

export default function App() {
  return (
    <NightVisionProvider>
      <MenuProvider>
        <Shell />
      </MenuProvider>
    </NightVisionProvider>
  );
}

function Shell() {
  const { open } = useMenu();
  return (
    <>
      <SkipLink />
      <Header />
      <div inert={open ? true : undefined}>
        <main id="main" tabIndex={-1}>
          <Hero />
          <Story />
          <HowToBuy />
          <Tokenomics />
          <Community />
          <Invitation />
        </main>
        <Footer />
        <MobileBar />
      </div>
    </>
  );
}
