import { Fruit } from "@prisma/client";
import prisma from "./plugins/prisma/prisma.service";
import * as argon from "argon2"

async function main() {

  // Clear existiing data
  await prisma.$executeRaw`TRUNCATE TABLE "Article" RESTART IDENTITY CASCADE`

  const mangoesArticles = [
    {
      title: "How to Stores Mangoes the Right Way",
      url: "https://www.realsimple.com/food-recipes/shopping-storing/food/how-to-store-mangoes",
      uploadDate: new Date("2023-05-26T09:40:35.369-04:00"),
      author: "Samantha Leffler",
      thumbnailUrl: "https://assets-jpcust.jwpsrv.com/thumbnails/dgomoa1g-720.jpg",
      type: Fruit.MANGO
    },
    {
      title: "The Best Way to Store Whole and Cut Fresh Mango",
      url: "https://uk.news.yahoo.com/style/best-way-store-whole-cut-153032102.html?guccounter=1&guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&guce_referrer_sig=AQAAAEq6rG3ldWgWFFfpQdrJAgymOT5xb3KbJllEyU8vZv0yPPmWrP7lmHllsUlcbX6VsCO-FE43VQ9MiScrIW-YS7HMvEWxdkTmT0SI8PUhIQNHvj45LHb7ikzzq6uyl-Gzwx9l9ILyMCbE8dpN6GE47H3y5S9FhEuoDQ3g3oy3M905",
      uploadDate: new Date("2024-02-04T00:00:00Z"),
      author: "Simone Gerber",
      thumbnailUrl: "https://s.yimg.com/ny/api/res/1.2/QhQTtM1.fDQccE9umPT7SA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTE1NjA7aD04NzY7Y2Y9d2VicA--/https://media.zenfs.com/en/tasting_table_543/f5f217907296d96ab2ec92f1795b9c66",
      type: Fruit.MANGO
    },
    {
      title: "Mango: Nutrition, Health Benefits, and How to Eat it",
      url: "https://www.healthline.com/nutrition/mango",
      uploadDate: new Date("2023-02-01T00:00:00Z"),
      author: "Ryan Raman",
      thumbnailUrl: "https://media.post.rvohealth.io/wp-content/uploads/2021/11/mango-mangos-732x549-thumbnail-732x549.jpg",
      type: Fruit.MANGO
    },
    {
      title: "Healthy Summer Diet: 5 Healthy Mango Recipes That Combine Flavour With Nutrition",
      url: "https://food.ndtv.com/food-drinks/healthy-summer-diet-5-healthy-mango-recipes-that-combine-flavour-with-nutrition-2047267",
      uploadDate: new Date("2023-03-21T16:52:00+05:30"),
      author: "NDTV Food Desk",
      thumbnailUrl: "https://i.ndtvimg.com/i/2016-05/mango-salad_625x350_51464264061.jpg?im=FaceCrop,algorithm=dnn,width=620,height=350",
      type: Fruit.MANGO
    },
    {
      title: "How to Tell if a Mango Is Bad",
      url: "https://foodsguy.com/bad-mango/",
      uploadDate: new Date("2021-06-19T00:00:00Z"),
      author: "Jaron",
      thumbnailUrl: "https://foodsguy.com/wp-content/uploads/2021/06/Mango-go-bye-bye.jpg",
      type: Fruit.MANGO
    },
    {
      title: "4 Ways to Tell if Your Mango Is Ripe",
      url: "https://www.allrecipes.com/how-to-tell-if-your-mango-is-ripe-7564460",
      uploadDate: new Date("2023-07-13T00:00:00Z"),
      author: "Ann Walczak",
      thumbnailUrl: "https://www.allrecipes.com/thmb/TwKJyI60YgVtZu7_9AndgdoYwBE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/how-to-tell-if-mango-is-ripe-4x3-1bcf96c65ed641b8aa77227422aa8f9c.jpg",
      type: Fruit.MANGO
    },
    {
      title: "Mango Nutrition Facts and Health Benefits",
      url: "https://www.verywellfit.com/mango-calories-and-nutrition-facts-3982611",
      uploadDate: new Date("2022-09-23T00:00:00Z"),
      author: "Shereen Lehman",
      thumbnailUrl: "https://www.verywellfit.com/thmb/6fQTVDMjHSpNFFkU423-0vUKc9k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/mango_annotated-42b38e4d9d5345aeb904ab56ab87dbab.jpg",
      type: Fruit.MANGO
    }
  ]
  const applesArticles = [
    {
      title: "10 Impressive Health Benefits of Apples",
      url: "https://www.healthline.com/nutrition/10-health-benefits-of-apples",
      uploadDate: new Date("2023-07-12T00:00:00Z"),
      author: "Ariane Lang",
      thumbnailUrl: "https://images.ctfassets.net/mrbo2ykgx5lt/31322/f5316c701e9b8fea629c51f3ae29abf2/frontiers-in-plant-science-apples.jpg?&w=1128&fm=webp",
      type: Fruit.APPLE
    },
    {
      title: "An Apple a Day Keeps the Doctor Away — Fact or Fiction?",
      url: "https://www.healthline.com/nutrition/an-apple-a-day-keeps-the-doctor-away#benefits",
      uploadDate: new Date("2020-06-06T00:00:00Z"),
      author: "Rachael Ajmera",
      thumbnailUrl: "https://media.baamboozle.com/uploads/images/590771/1653562539_13257_import-url.jpeg",
      type: Fruit.APPLE
    },
    {
      title: "Will Eating Apples Help If You Have Acid Reflux?",
      url: "https://www.healthline.com/health/digestive-health/apples-and-acid-reflux",
      uploadDate: new Date("2024-05-09T00:00:00Z"),
      author: "Heather Hobbs",
      thumbnailUrl: "https://media.post.rvohealth.io/wp-content/uploads/2024/04/box-of-juicy-apples-1200x628-facebook.jpg",
      type: Fruit.APPLE
    },
    {
      title: "Know your tropical fruit- Malay Apple",
      url: "https://realliferecess.com/know-you-tropical-fruit-malay-apple/",
      uploadDate: new Date("2022-03-14T00:00:00Z"),
      author: "Megan Rodden",
      thumbnailUrl: "https://realliferecess.com/wp-content/uploads/2022/03/IMG_0948.jpg",
      type: Fruit.APPLE
    },
    {
      title: "5 Health Benefits of Apples",
      url: "https://www.eatingwell.com/article/17769/5-health-benefits-of-an-apple/",
      uploadDate: new Date("2024-04-26T00:00:00Z"),
      author: "Laurie Herr",
      thumbnailUrl: "https://www.eatingwell.com/thmb/tKuKLufVTywcSHZ2b1T5uYpxPhw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/apple-peanut-butter-cinnamon-d0713ec01d854a28b52f9df411f999b9.jpeg",
      type: Fruit.APPLE
    },
    {
      title: "The History of the “Forbidden” Fruit",
      url: "https://www.nationalgeographic.com/culture/article/history-of-apples",
      uploadDate: new Date("2014-07-22T00:00:00Z"),
      author: "Rebecca Rupp",
      thumbnailUrl: "https://i.natgeofe.com/n/7b94ba9f-8eb3-4a6b-91e9-1ca331db5da4/2734949408_9ef81bac09_z.jpg?w=1280&h=854",
      type: Fruit.APPLE
    },
    {
      title: "Are apples good for diabetes?",
      url: "",
      uploadDate: new Date("2023-01-10T00:00:00Z"),
      author: "Jon Johnson",
      thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAameYTVejpTWK-vzSCKJomldtpJaga5bLrA&s",
      type: Fruit.APPLE
    },
    {
      title: "Apple Nutrition Facts and Health Benefits",
      url: "https://www.verywellfit.com/apples-nutrition-facts-calories-and-their-health-benefits-4117992",
      uploadDate: new Date("2024-05-16T00:00:00Z"),
      author: "Jonathan Valdez",
      thumbnailUrl: "https://www.verywellfit.com/thmb/Dq6CC8KuxqaOrKEKxpHM5ppv0yg=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/apples_annotated-4bd499eed8a64824b5f61b5aec853d78.jpg",
      type: Fruit.APPLE
    },
    {
      title: "Red Delicious",
      url: "https://medium.com/@mysweettoothgoal/apple-fruit-are-most-beloved-and-well-known-fruit-in-the-world-f51afd7c4f9e",
      uploadDate: new Date("2023-06-12T00:00:00Z"),
      author: "Fauzia Khan",
      thumbnailUrl: "https://miro.medium.com/v2/resize:fit:600/format:webp/0*Y22XGmfvQaHYK6xw.png",
      type: Fruit.APPLE
    },
    {
      title: "What to know about apples",
      url: "https://www.medicalnewstoday.com/articles/267290#summary",
      uploadDate: new Date("2023-11-21T00:00:00Z"),
      author: "Yvette Brazier",
      thumbnailUrl: "https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*",
      type: Fruit.APPLE
    },


  ]
    const orangeArticles = [
      {
      title: "What to know about oranges",
      url: "https://www.medicalnewstoday.com/articles/272782",
      uploadDate: new Date("2023-07-18T00:00:00Z"),
      author: "Megan Ware",
      thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4NOD3IhLnNA87rF10Q_ypVfebRAEs6bZyFg&s",
      type: Fruit.ORANGE
      },
      {
      title: "Oranges: Nutrients, Benefits, Juice, and More",
      url: "https://www.healthline.com/nutrition/oranges",
      uploadDate: new Date("2023-04-20T00:00:00Z"),
      author: "Jillian Kubala",
      thumbnailUrl: "https://images.pexels.com/photos/461415/pexels-photo-461415.jpeg?cs=srgb&dl=pexels-pixabay-461415.jpg&fm=jpg",
      type: Fruit.ORANGE
      },
      {
      title: "Is Orange Juice Good or Bad for You?",
      url: "https://www.healthline.com/nutrition/orange-juice",
      uploadDate: new Date("2023-07-05T00:00:00Z"),
      author: "Marsha Mcculloch",
      thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx8dD6zAMt9Pp2s1WTKhzGxK3UsnFCFfnGvw&s",
      type: Fruit.ORANGE
      },
      {
      title: "5 Surprising Health Benefits of Orange Juice",
      url: "https://www.healthline.com/nutrition/orange-juice-benefits",
      uploadDate: new Date("2023-08-29T00:00:00Z"),
      author: "Rachael Ajmera",
      thumbnailUrl: "https://cdn.britannica.com/94/131094-050-8687A599/blossom-fruit-orange.jpg",
      type: Fruit.ORANGE
      },
      {
      title: "7 Reasons to Eat More Citrus Fruits",
      url: "https://www.healthline.com/nutrition/citrus-fruit-benefits",
      uploadDate: new Date("2023-07-11T00:00:00Z"),
      author: "Kerri-Ann Jennings",
      thumbnailUrl: "https://plus.unsplash.com/premium_photo-1667443200845-2cf024ef46c6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b3JhbmdlJTIwZnJ1aXR8ZW58MHx8MHx8fDA%3D",
      type: Fruit.ORANGE
      },
      {
      title: "9 Types of Oranges to Try",
      url: "https://www.health.com/types-of-oranges-8410794",
      uploadDate: new Date("2024-01-08T00:00:00Z"),
      author: "Johna Burdeos",
      thumbnailUrl: "https://www.health.com/thmb/17kyLFjc_Tx3M-jU2WjNPxXmLJ4=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/TypesOfOranges-f95153e786554ba5b6da0370387ee563.jpg",
      type: Fruit.ORANGE
      },
      {
      title: "The global orange juice crisis is caused by disease and bad weather",
      url: "https://theconversation.com/the-global-orange-juice-crisis-is-caused-by-disease-and-bad-weather-heres-how-to-keep-it-on-the-breakfast-table-231645",
      uploadDate: new Date("2024-06-07T15:28:00Z"),
      author: "Jas Kalra",
      thumbnailUrl: "https://images.theconversation.com/files/598846/original/file-20240605-17-7l8po6.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=754&h=503&fit=crop&dpr=1",
      type: Fruit.ORANGE
      },
      {
      title: "Health Benefits of Oranges",
      url: "https://www.webmd.com/diet/health-benefits-oranges",
      uploadDate: new Date("2022-11-27T00:00:00Z"),
      author: "WebMD Editorial Contributors",
      thumbnailUrl: "",
      type: Fruit.ORANGE
      },
      {
      title: "Health Benefits of Oranges",
      url: "https://www.health.com/food/health-benefits-oranges",
      uploadDate: new Date("2023-03-29T00:00:00Z"),
      author: " Cynthia Sass",
      thumbnailUrl: "https://www.health.com/thmb/9nsTGcBM-Oln1lL2OTzhCSkuIj8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Health-Stocksy_txp5e95690asrw300_Medium_934585-e870449543284eed8aa4be52fc09a4ed.jpg",
      type: Fruit.ORANGE
      },
      {
      title: "health Benefits of Oranges",
      url: "https://timesofindia.indiatimes.com/life-style/health-fitness/diet/why-you-should-eat-oranges/articleshow/4662391.cms",
      uploadDate: new Date("2022-04-11T03:59:00Z"),
      author: "Vishwa Purohit",
      thumbnailUrl: "https://static.toiimg.com/thumb/msid-4662399,imgsize-13900,width-400,resizemode-4/4662399.jpg",
      type: Fruit.ORANGE
      },
      {
      title: "Oranges 101: A Complete Guide",
      url: "https://www.everydayhealth.com/diet-and-nutrition/oranges/guide/",
      uploadDate: new Date("2024-01-11T00:00:00Z"),
      author: "Kristeen Cherney",
      thumbnailUrl: "https://images.everydayhealth.com/images/diet-nutrition/oranges-101-a-complete-guide-alt-1440x810.jpg?sfvrsn=50ad0a19_7",
      type: Fruit.ORANGE
    },


  ]

  for (let index = 0; index < mangoesArticles.length; index++) {
    await prisma.article.create({
      data: {
        ...mangoesArticles[index],
        ...applesArticles[index],
        ...orangeArticles[index]

      }
    })
    
  }

  // Create user
  const user = await prisma.user.findUnique({
    where: {
      email: "freshgrade@gmail.com"
    }
  })
  
  if (!user) {
    await prisma.user.create({
      data: {
        email: "freshgrade@gmail.com",
        hash: await argon.hash("freshgrade123"),
        username: "freshgrade",
        firstName: "Fresh",
        lastName: "Grade"
      }
    })
  }
}

main()
  .then(async () => {
    console.log('Done!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    console.log('Error in seeding');
    await prisma.$disconnect();
    process.exit(1);
  });