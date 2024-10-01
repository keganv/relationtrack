export default function HomeCards() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16 mt-20 px-4 pb-10">
      <div className="home-card">
        <header className="col-10 angle-left dark-blue text-white text-center mtne">
          God
        </header>
        <img src="/images/god-cross.jpg" className="border-med" alt="Cross in sunlight."/>
        <p className="reveal">
          Your loving creator, God wants you. You need Him.
          Prioritize and track your daily walk with God.
        </p>
      </div>
      <div className="home-card">
        <header className="col-10 angle-right dark-blue text-white text-center mtne">
          Marriage
        </header>
        <img src="/images/marriage.jpg" className="border-med" alt="Marriage wedding dance."/>
        <p className="reveal">
          Stay engaged with your spouse.
          Make it a point to remember the reasons you said I do.
        </p>
      </div>
      <div className="home-card">
        <header className="col-10 angle-left dark-blue text-white text-center mtne">
          Children
        </header>
        <img src="/images/child-swing.jpg" className="border-med" alt="Child on swing set"/>
        <p className="reveal">
          There are no second chances to raise your kids.
          New born, or fully grown, your children are a precious gift.
        </p>
      </div>
      <div className="home-card">
        <header className="col-10 angle-right dark-blue text-white text-center mtne">
          Parents
        </header>
        <img src="/images/parents.jpg" className="border-med" alt="Parents, couple."/>
        <p className="reveal">
          Mom and Dad still want to know they matter.
          Honor the ones who brought you in this world.
        </p>
      </div>
      <div className="home-card">
        <header className="col-10 angle-left dark-blue text-white text-center mtne">
          Siblings
        </header>
        <img src="/images/siblings.jpg" className="border-med" alt="Brothers, siblings"/>
        <p className="reveal">
          Life moves fast and often separates us from our siblings.
          Stay connected in their lives.
        </p>
      </div>
      <div className="home-card">
        <header className="col-10 angle-right dark-blue text-white text-center mtne">
          Friends
        </header>
        <img src="/images/friends.jpg" className="border-med" alt="Friendship"/>
        <p className="reveal">
          A good friend is hard to find.
          Be sure not to lose those important relationships.
        </p>
      </div>
      <div className="home-card">
        <header className="col-10 angle-left dark-blue text-white text-center mtne">
          Relatives
        </header>
        <img src="/images/relatives.jpg" className="border-med" alt="Family album"/>
        <p className="reveal">
          Family should be there for each other.
          Celebrate your family members, let them know you care.
        </p>
      </div>
      <div className="home-card">
        <header className="col-10 angle-right dark-blue text-white text-center mtne">
          Pets
        </header>
        <img src="/images/pets.jpg" className="border-med" alt="Dog and cat"/>
        <p className="reveal">
          Our pets can get lonely, forgotten, and depressed.
          Remember to love on your furry friends.
        </p>
      </div>
    </section>
  );
}
