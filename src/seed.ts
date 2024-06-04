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
    },
    {
      title: "The Best Way to Store Whole and Cut Fresh Mango",
      url: "https://uk.news.yahoo.com/style/best-way-store-whole-cut-153032102.html?guccounter=1&guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&guce_referrer_sig=AQAAAEq6rG3ldWgWFFfpQdrJAgymOT5xb3KbJllEyU8vZv0yPPmWrP7lmHllsUlcbX6VsCO-FE43VQ9MiScrIW-YS7HMvEWxdkTmT0SI8PUhIQNHvj45LHb7ikzzq6uyl-Gzwx9l9ILyMCbE8dpN6GE47H3y5S9FhEuoDQ3g3oy3M905",
      uploadDate: new Date("2024-02-04T00:00:00Z"),
      author: "Simone Gerber",
      thumbnailUrl: "https://s.yimg.com/ny/api/res/1.2/QhQTtM1.fDQccE9umPT7SA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTE1NjA7aD04NzY7Y2Y9d2VicA--/https://media.zenfs.com/en/tasting_table_543/f5f217907296d96ab2ec92f1795b9c66"
    },
    {
      title: "Mango: Nutrition, Health Benefits, and How to Eat it",
      url: "https://www.healthline.com/nutrition/mango",
      uploadDate: new Date("2023-02-01T00:00:00Z"),
      author: "Ryan Raman",
      thumbnailUrl: "https://media.post.rvohealth.io/wp-content/uploads/2021/11/mango-mangos-732x549-thumbnail-732x549.jpg"
    },
    {
      title: "Healthy Summer Diet: 5 Healthy Mango Recipes That Combine Flavour With Nutrition",
      url: "https://food.ndtv.com/food-drinks/healthy-summer-diet-5-healthy-mango-recipes-that-combine-flavour-with-nutrition-2047267",
      uploadDate: new Date("2023-03-21T16:52:00+05:30"),
      author: "NDTV Food Desk",
      thumbnailUrl: "https://i.ndtvimg.com/i/2016-05/mango-salad_625x350_51464264061.jpg?im=FaceCrop,algorithm=dnn,width=620,height=350"
    },
    {
      title: "How to Tell if a Mango Is Bad",
      url: "https://foodsguy.com/bad-mango/",
      uploadDate: new Date("2021-06-19T00:00:00Z"),
      author: "Jaron",
      thumbnailUrl: "https://foodsguy.com/wp-content/uploads/2021/06/Mango-go-bye-bye.jpg"
    },
    {
      title: "4 Ways to Tell if Your Mango Is Ripe",
      url: "https://www.allrecipes.com/how-to-tell-if-your-mango-is-ripe-7564460",
      uploadDate: new Date("2023-07-13T00:00:00Z"),
      author: "Ann Walczak",
      thumbnailUrl: "https://www.allrecipes.com/thmb/TwKJyI60YgVtZu7_9AndgdoYwBE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/how-to-tell-if-mango-is-ripe-4x3-1bcf96c65ed641b8aa77227422aa8f9c.jpg"
    },
    {
      title: "Mango Nutrition Facts and Health Benefits",
      url: "https://www.verywellfit.com/mango-calories-and-nutrition-facts-3982611",
      uploadDate: new Date("2022-09-23T00:00:00Z"),
      author: "Shereen Lehman",
      thumbnailUrl: "https://www.verywellfit.com/thmb/6fQTVDMjHSpNFFkU423-0vUKc9k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/mango_annotated-42b38e4d9d5345aeb904ab56ab87dbab.jpg"
    }
  ]

  for (let index = 0; index < mangoesArticles.length; index++) {
    await prisma.article.create({
      data: {
        ...mangoesArticles[index]
      }
    })
    
  }

  // Create user
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