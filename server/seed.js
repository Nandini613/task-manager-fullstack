const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const students = [
  { name: "Aarav Sharma", email: "aarav.sharma.edu@gmail.com" },
  { name: "Abigail Johnson", email: "abigail.j.students@gmail.com" },
  { name: "Alexander Wright", email: "alex.wright.acad@gmail.com" },
  { name: "Amelia Tanaka", email: "amelia.tanaka99@gmail.com" },
  { name: "Andrew Novak", email: "andrew.novak.study@gmail.com" },
  { name: "Ananya Iyer", email: "ananya.iyer.edu@gmail.com" },
  { name: "Benjamin Cruz", email: "ben.cruz.learning@gmail.com" },
  { name: "Chloe Dubois", email: "chloe.dubois.schol@gmail.com" },
  { name: "Daniel Kim", email: "daniel.kim.class@gmail.com" },
  { name: "Emma Watson", email: "emma.watson.edu@gmail.com" },
  { name: "Ethan Mbaye", email: "ethan.mbaye98@gmail.com" },
  { name: "Fatima Al-Mansoor", email: "fatima.almansoor.acad@gmail.com" },
  { name: "Gabriel Silva", email: "gabriel.silva.study@gmail.com" },
  { name: "Grace O'Connor", email: "grace.oconnor.edu@gmail.com" },
  { name: "Hiroshi Sato", email: "hiroshi.sato.class@gmail.com" },
  { name: "Isabella Rossi", email: "isabella.rossi99@gmail.com" },
  { name: "Jacob Martinez", email: "jacob.martinez.schol@gmail.com" },
  { name: "Jessica Taylor", email: "jessica.taylor.edu@gmail.com" },
  { name: "Lucas Nguyen", email: "lucas.nguyen.study@gmail.com" },
  { name: "Mia Kowalski", email: "mia.kowalski.acad@gmail.com" },
  { name: "Noah Davies", email: "noah.davies.class@gmail.com" },
  { name: "Olivia Petrova", email: "olivia.petrova98@gmail.com" },
  { name: "Ryan Gallagher", email: "ryan.gallagher.edu@gmail.com" },
  { name: "Sophia Hansen", email: "sophia.hansen.schol@gmail.com" },
  { name: "William Brown", email: "william.brown.study@gmail.com" },
  { name: "Zara Ahmed", email: "zara.ahmed.class@gmail.com" },
  { name: "Liam Smith", email: "liam.smith.edu@gmail.com" },
  { name: "Charlotte Jones", email: "charlotte.j.99@gmail.com" },
  { name: "Mason Garcia", email: "mason.garcia.acad@gmail.com" },
  { name: "Evelyn Martinez", email: "evelyn.m.study@gmail.com" },
  { name: "Elijah Rodriguez", email: "elijah.r.class@gmail.com" },
  { name: "Harper Williams", email: "harper.w.schol@gmail.com" },
  { name: "Oliver Wilson", email: "oliver.wilson.edu@gmail.com" },
  { name: "Emily Anderson", email: "emily.a.learning@gmail.com" },
  { name: "James Thomas", email: "james.thomas98@gmail.com" },
  { name: "Avery Taylor", email: "avery.taylor.acad@gmail.com" },
  { name: "Benjamin Moore", email: "benjamin.m.study@gmail.com" },
  { name: "Sofia Jackson", email: "sofia.j.class@gmail.com" },
  { name: "Lucas Martin", email: "lucas.martin.edu@gmail.com" },
  { name: "Madison Lee", email: "madison.lee.schol@gmail.com" },
  { name: "Henry Thompson", email: "henry.t.learning@gmail.com" },
  { name: "Layla White", email: "layla.white99@gmail.com" },
  { name: "Alexander Harris", email: "alex.harris.acad@gmail.com" },
  { name: "Victoria Sanchez", email: "victoria.s.study@gmail.com" },
  { name: "Michael Clark", email: "michael.clark.class@gmail.com" },
  { name: "Aria Ramirez", email: "aria.ramirez.edu@gmail.com" },
  { name: "Daniel Lewis", email: "daniel.lewis.schol@gmail.com" },
  { name: "Grace Robinson", email: "grace.r.learning@gmail.com" },
  { name: "Matthew Walker", email: "matthew.w98@gmail.com" },
  { name: "Chloe Young", email: "chloe.young.acad@gmail.com" },
  { name: "Samuel Allen", email: "samuel.allen.study@gmail.com" },
  { name: "Zoe King", email: "zoe.king.class@gmail.com" },
  { name: "David Wright", email: "david.wright.edu@gmail.com" },
  { name: "Natalie Scott", email: "natalie.s.schol@gmail.com" },
  { name: "Joseph Torres", email: "joseph.torres99@gmail.com" },
  { name: "Lily Nguyen", email: "lily.nguyen.acad@gmail.com" },
  { name: "Carter Hill", email: "carter.hill.study@gmail.com" },
  { name: "Hannah Flores", email: "hannah.f.class@gmail.com" },
  { name: "Owen Green", email: "owen.green.edu@gmail.com" },
  { name: "Lillian Adams", email: "lillian.adams.schol@gmail.com" },
  { name: "Wyatt Nelson", email: "wyatt.n.learning@gmail.com" },
  { name: "Addie Baker", email: "addie.baker98@gmail.com" },
  { name: "John Hall", email: "john.hall.acad@gmail.com" },
  { name: "Aubrey Rivera", email: "aubrey.r.study@gmail.com" },
  { name: "Jack Campbell", email: "jack.campbell.class@gmail.com" },
  { name: "Ellie Mitchell", email: "ellie.m.edu@gmail.com" },
  { name: "Luke Carter", email: "luke.carter.schol@gmail.com" },
  { name: "Stella Roberts", email: "stella.roberts99@gmail.com" },
  { name: "Dylan Gomez", email: "dylan.gomez.acad@gmail.com" },
  { name: "Natalie Phillips", email: "natalie.p.study@gmail.com" },
  { name: "Levi Evans", email: "levi.evans.class@gmail.com" },
  { name: "Leah Turner", email: "leah.turner.edu@gmail.com" },
  { name: "Isaac Diaz", email: "isaac.diaz.schol@gmail.com" },
  { name: "Hazel Cruz", email: "hazel.cruz.learning@gmail.com" },
  { name: "Gabriel Parker", email: "gabriel.p98@gmail.com" },
  { name: "Violet Edwards", email: "violet.e.acad@gmail.com" },
  { name: "Anthony Collins", email: "anthony.c.study@gmail.com" },
  { name: "Aurora Morris", email: "aurora.morris.class@gmail.com" },
  { name: "Leo Rogers", email: "leo.rogers.edu@gmail.com" },
  { name: "Savannah Reed", email: "savannah.r.schol@gmail.com" },
  { name: "Julian Cook", email: "julian.cook99@gmail.com" },
  { name: "Audrey Morgan", email: "audrey.m.acad@gmail.com" },
  { name: "Hudson Bell", email: "hudson.bell.study@gmail.com" },
  { name: "Brooklyn Murphy", email: "brooklyn.m.class@gmail.com" },
  { name: "Asher Bailey", email: "asher.bailey.edu@gmail.com" },
  { name: "Bella Rivera", email: "bella.rivera.schol@gmail.com" },
  { name: "Christopher Cooper", email: "chris.cooper.learning@gmail.com" },
  { name: "Skyler Richardson", email: "skyler.r98@gmail.com" },
  { name: "Josiah Cox", email: "josiah.cox.acad@gmail.com" },
  { name: "Claire Howard", email: "claire.h.study@gmail.com" },
  { name: "Andrew Ward", email: "andrew.ward.class@gmail.com" },
  { name: "Paisley Torres", email: "paisley.t.edu@gmail.com" },
  { name: "Thomas Peterson", email: "thomas.p.schol@gmail.com" },
  { name: "Autumn Gray", email: "autumn.gray99@gmail.com" },
  { name: "Miles James", email: "miles.james.acad@gmail.com" },
  { name: "Elena Watson", email: "elena.w.study@gmail.com" },
  { name: "Nathan Brooks", email: "nathan.brooks.class@gmail.com" },
  { name: "Maya Kelly", email: "maya.kelly.edu@gmail.com" },
  { name: "Caleb Sanders", email: "caleb.s.schol@gmail.com" },
  { name: "Elena Price", email: "elena.price.learning@gmail.com" }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    let addedCount = 0;
    
    for (const student of students) {
      const exists = await User.findOne({ email: student.email });
      if (!exists) {
        const newUser = new User({
          name: student.name,
          email: student.email,
          password: hashedPassword,
          role: 'member'
        });
        await newUser.save();
        addedCount++;
      }
    }

    console.log(`Successfully seeded ${addedCount} students into the database!`);
    console.log("Their default password is 'password123'");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
