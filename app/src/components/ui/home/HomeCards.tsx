export default function HomeCards() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16 mt-20 px-4 pb-10">
      <div className="home-card">
        <header className="angle-left dark-blue text-white text-center">
          God
        </header>
        <img src="/images/god-cross.jpg" alt="Cross in sunlight."/>
        <p className="reveal">
          Your loving creator, God wants you. You need Him.
          Prioritize and track your daily walk with God.
        </p>
      </div>
      <div className="home-card">
        <header className="angle-right dark-blue text-white text-center">
          Marriage
        </header>
        <img src="/images/marriage.jpg" alt="Marriage wedding dance."/>
        <p className="reveal">
          Stay engaged with your spouse.
          Make it a point to remember the reasons you said I do.
        </p>
      </div>
      <div className="home-card">
        <header className="angle-left dark-blue text-white text-center">
          Children
        </header>
        <img src="/images/child-swing.jpg" alt="Child on swing set"/>
        <p className="reveal">
          There are no second chances to raise your kids.
          New born, or fully grown, your children are a precious gift.
        </p>
      </div>
      <div className="home-card">
        <header className="angle-right dark-blue text-white text-center">
          Parents
        </header>
        <img src="/images/parents.jpg" alt="Parents, couple."/>
        <p className="reveal">
          Mom and Dad still want to know they matter.
          Honor the ones who brought you in this world.
        </p>
      </div>
      <div className="home-card">
        <header className="angle-left dark-blue text-white text-center">
          Siblings
        </header>
        <img src="/images/siblings.jpg" alt="Brothers, siblings"/>
        <p className="reveal">
          Life moves fast and often separates us from our siblings.
          Stay connected in their lives.
        </p>
      </div>
      <div className="home-card">
        <header className="angle-right dark-blue text-white text-center">
          Friends
        </header>
        <img src="/images/friends.jpg" alt="Friendship"/>
        <p className="reveal">
          A good friend is hard to find.
          Be sure not to lose those important relationships.
        </p>
      </div>
      <div className="home-card">
        <header className="angle-left dark-blue text-white text-center">
          Relatives
        </header>
        <img src="/images/relatives.jpg" alt="Family album"/>
        <p className="reveal">
          Family should be there for each other.
          Celebrate your family members, let them know you care.
        </p>
      </div>
      <div className="home-card">
        <header className="angle-right dark-blue text-white text-center">
          Pets
        </header>
        <img src="/images/pets.jpg" alt="Dog and cat"/>
        <p className="reveal">
          Our pets can get lonely, forgotten, and depressed.
          Remember to love on your furry friends.
        </p>
      </div>
    </section>
  );
}
