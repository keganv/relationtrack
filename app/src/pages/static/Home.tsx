import { Link } from "react-router";
import { useEffect } from "react";
import Footer from "../../components/ui/Footer";
import ApplicationLogo from "../../components/ui/ApplicationLogo";
import HomeNav from "../../components/ui/home/HomeNav";
import Banners from "../../components/ui/home/Banners";
import HomeCards from "../../components/ui/home/HomeCards";

export default function Home() {
  useEffect(()=>{
    const images: string[] = ['/images/banner-couple.jpg', '/images/banner-swing.jpg'];
    const banner: HTMLElement | null = document.getElementById('banner-image');
    if (banner) {
      banner.style.backgroundImage = `url('${images[Math.floor(Math.random() * images.length)]}')`;
    }
  }, []);

  return (
    <>
      <header className="main" role="banner">
        <div className="container mx-auto flex flex-row justify-between items-center">
          <Link to={'/'}>
            <ApplicationLogo className="h-[30px]" />
          </Link>
          <HomeNav />
        </div>
      </header>
      <Banners />
      <main className="bg-main-blue mt-4" role="main">
        <div className="bg-main-dark-blue angle-left text-center mb-4 md:w-[56%] w-[94%] m-auto">
          <h1 className="heading bg-white angle-left text-blue">Make Relationships A Priority</h1>
        </div>
        <HomeCards/>
        <section className="bg-main-dark-blue angle-left striped-right">
          <div className="mt-10 pt-12 pb-4">
            <div className="bg-main-light-blue angle-right text-center mb-4 md:w-[56%] w-[94%] m-auto">
              <h2 className="heading bg-white angle-right text-blue">Keeping Track</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 px-2">
              <div className="bg-main-light-blue angle-left mr-2">
                <div className="bg-white angle-left">
                  <p className="pt-2">
                    You might keep track of a lot of things; time, money, weather, politics, calories, exercise,
                    just to name a few. But what about your relationships? Do you track your effort and time spent
                    to preserve and build the relationships with those you love? Don't wait until it's too late.
                  </p>
                </div>
              </div>
              <div className="bg-main-light-blue angle-right ml-2">
                <div className="bg-white angle-right">
                  <p className="pt-2">
                    The world has never had more distractions and busyness than we see today. It's all too easy
                    to neglect the things that should matter the most, our relationships. That's why Relation Track
                    was built. It is here to provide an easy, fun, and <strong>always free</strong> way to help you
                    stay connected, or reconnect to the ones you love.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center mt-10 mb-6">
              <Link to={'/register'} className="handwriting text-white text-8xl">Sign Up Now!</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
