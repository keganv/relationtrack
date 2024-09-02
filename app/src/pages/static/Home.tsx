import {Link} from 'react-router-dom';
import useAuthContext from '../../hooks/useAuthContext';
import {FormEvent, useEffect} from 'react';
import Footer from '../../components/ui/Footer';

export default function Home() {
  const { logout, user } = useAuthContext();

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    logout();
  }

  useEffect(()=>{
    const images: string[] = ['/images/banner-couple.jpg', '/images/banner-swing.jpg'];
    const banner: HTMLElement | null = document.getElementById('banner-image');
    if (banner) {
      banner.style.backgroundImage = `url('${images[Math.floor(Math.random() * images.length)]}')`;
    }
  }, []);

  return (
    <>
      <header className="fixed bg-main-dark-blue top-0 left-0 right-0 z-50 px-2 md:px-0" role="banner">
        <div className="container mx-auto flex flex-row justify-between items-center h-[55px]">
          <Link to={'/'}>
            <img src="/images/logo-sm.png" alt="Relation Track" className="h-[35px]" />
          </Link>
          <nav role="navigation" className="main text-white">
            {user &&
                <ul className="flex flex-row text-xs md:text-base">
                  <li className="mr-4">
                    <Link to={'/dashboard'}>Dashboard</Link>
                  </li>
                  <li>
                    <a type="submit" className="cursor-pointer" onClick={handleLogout}>
                      <i className="fa-solid fa-right-from-bracket"></i> Log Out
                    </a>
                  </li>
                </ul>}
            {!user &&
                <ul>
                  <li>
                    <Link to={'/register'}>Register</Link>
                  </li>
                  <li>
                    <Link to={'/login'}>Log In</Link>
                  </li>
                </ul>}
          </nav>
        </div>
      </header>
      <header className="flex row align-middle" role="banner">
        <Link to={'/'} className="logo">
          <img src="/images/logo-sm.png" alt="Relation Track"/>
        </Link>
        <nav role="navigation" className="text-white">
          {user &&
            <ul className="flex flex-row text-white">
                <li className="mr-1 text-white">
                  <Link to={'/dashboard'}>Dashboard</Link>
                </li>
                <li>
                  <button type="submit" className="text" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i> Log Out
                  </button>
                </li>
            </ul>}
          {!user &&
            <ul>
              <li>
                <Link to={'/register'}>Register</Link>
              </li>
              <li>
                <Link to={'/login'}>Log In</Link>
              </li>
            </ul>}
        </nav>
      </header>
      <div id="banners" className="flex row wrap align-bottom justify-center">
        <div className="banner-container">
          <div id="banner-image" className="banner-image flex column wrap justify-center align-middle">
            <div className="banner-text mtn-extra">Keep track of what really matters.</div>
            <div className="banner-text margin-top"><em>Your Relationships!</em></div>
            <nav className="actions flex row wrap justify-center align-middle">
              {user && <>
                <Link to={'dashboard'} className="button red transparent margin-right text-xs">Dashboard</Link>
                <button type="submit" className="button white transparent">
                  <i className="fa-solid fa-right-from-bracket"></i> Log Out
                </button>
              </>}
              {!user && <>
                <Link to={'register'} className="button red transparent margin-right">Register</Link>
                <Link to={'login'} className="button white transparent margin-left">Log in</Link>
              </>}
              </nav>
          </div>
        </div>
      </div>
      <main className="home blue pl pr" role="main">
        <section className="flex row align-top justify-center pb mb">
          <div className="angle-left dark-blue margin-bottom text-center">
            <h1 className="heading white angle-left text-blue">Make Relationships A Priority</h1>
          </div>
        </section>
        <section className="flex row wrap justify-between">
          <div className="col-3 col-6-sm pa mb">
            <div className="card justify-center">
              <header className="col-10 angle-left dark-blue text-white text-center mtne">
                God
              </header>
              <img src="/images/god-cross.jpg" className="border-med" alt="Cross in sunlight." />
              <p className="reveal">
                Your loving creator, God wants you. You need Him.
                Prioritize and track your daily walk with God.
              </p>
            </div>
          </div>
          <div className="col-3 col-6-sm pa mb">
            <div className="card justify-center">
              <header className="col-10 angle-right dark-blue text-white text-center mtne">
                Marriage
              </header>
              <img src="/images/marriage.jpg" className="border-med" alt="Marriage wedding dance." />
              <p className="reveal">
                Stay engaged with your spouse.
                Make it a point to remember the reasons you said I do.
              </p>
            </div>
          </div>
          <div className="col-3 col-6-sm pa mb">
            <div className="card justify-center">
              <header className="col-10 angle-left dark-blue text-white text-center mtne">
                Children
              </header>
              <img src="/images/child-swing.jpg" className="border-med" alt="Child on swing set" />
              <p className="reveal">
                There are no second chances to raise your kids.
                New born, or fully grown, your children are a precious gift.
              </p>
            </div>
          </div>
          <div className="col-3 col-6-sm pa mb">
            <div className="card justify-center">
              <header className="col-10 angle-right dark-blue text-white text-center mtne">
                Parents
              </header>
              <img src="/images/parents.jpg" className="border-med" alt="Parents, couple." />
              <p className="reveal">
                Mom and Dad still want to know they matter.
                Honor the ones who brought you in this world.
              </p>
            </div>
          </div>
          <div className="col-3 col-6-sm pa mb">
            <div className="card justify-center">
              <header className="col-10 angle-left dark-blue text-white text-center mtne">
                Siblings
              </header>
              <img src="/images/siblings.jpg" className="border-med" alt="Brothers, siblings" />
              <p className="reveal">
                Life moves fast and often separates us from our siblings.
                Stay connected in their lives.
              </p>
            </div>
          </div>
          <div className="col-3 col-6-sm pa mb">
            <div className="card justify-center">
              <header className="col-10 angle-right dark-blue text-white text-center mtne">
                Friends
              </header>
              <img src="/images/friends.jpg" className="border-med" alt="Friendship" />
              <p className="reveal">
                A good friend is hard to find.
                Be sure not to lose those important relationships.
              </p>
            </div>
          </div>
          <div className="col-3 col-6-sm pa mb">
            <div className="card justify-center">
              <header className="col-10 angle-left dark-blue text-white text-center mtne">
                Relatives
              </header>
              <img src="/images/relatives.jpg" className="border-med" alt="Family album" />
              <p className="reveal">
                Family should be there for each other.
                Celebrate your family members, let them know you care.
              </p>
            </div>
          </div>
          <div className="col-3 col-6-sm pa mb">
            <div className="card justify-center">
              <header className="col-10 angle-right dark-blue text-white text-center mtne">
                Pets
              </header>
              <img src="/images/pets.jpg" className="border-med" alt="Dog and cat" />
              <p className="reveal">
                Our pets can get lonely, forgotten, and depressed.
                Remember to love on your furry friends.
              </p>
            </div>
          </div>
        </section>
      </main>
      <section className="blue">
        <div className="dark-blue angle-left striped-right">
          <div className="flex align-top justify-center mt">
            <div className="angle-right light-blue mb mte text-center">
              <h2 className="heading white angle-right text-blue">Keeping Track</h2>
            </div>
          </div>
          <div className="flex wrap align-center justify-center align-items-stretch">
            <div className="angle-left light-blue col-5 col-12-sm pae ml mr mbe">
              <div className="flex angle-left white align-middle h-100">
                <p className="mn pt">
                  You might keep track of a lot of things; time, money, weather, politics, calories, exercise,
                  just to name a few. But what about your relationships? Do you track your effort and time spent
                  to preserve and build the relationships with those you love? Don't wait until it's too late.
                </p>
              </div>
            </div>
            <div className="angle-right light-blue col-5 col-12-sm pae ml mr mbe">
              <div className="flex angle-right white align-middle h-100">
                <p className="mn pt">
                  The world has never had more distractions and busyness than we see today. It's all too easy
                  to neglect the things that should matter the most, our relationships. That's why Relation Track
                  was built. It is here to provide an easy, fun, and <strong>always free</strong> way to help you
                  stay connected, or reconnect to the ones you love.
                </p>
              </div>
            </div>
            <div className="col-12 text-center ma pa">
              <Link to={'/register'} className="handwriting bold font-xxl font-white">Sign Up Now!</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
