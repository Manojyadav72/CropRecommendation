import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../header/Header.jsx";
import Footer from "../footer/Footer.jsx";
import "./BlogPage.css";

const blogsData = [
  {
    id: 1,
    image: "/images/crops/cotton.jpg",
    link: "https://ncipm.icar.gov.in/",
    en: {
      title: "Cotton Pest Management: Defeating the Pink Bollworm",
      category: "Cotton Info",
      date: "May 10, 2026",
      readTime: "5 min read",
      author: "Vikas Singh",
      excerpt: "The pink bollworm is a persistent threat to cotton farmers. Discover integrated pest management (IPM) strategies, from pheromone traps to timely insecticide application to save your high-value crop."
    },
    hi: {
      title: "कपास कीट प्रबंधन: गुलाबी सुंडी को हराना",
      category: "कपास की जानकारी",
      date: "10 मई, 2026",
      readTime: "5 मिनट पढ़ें",
      author: "विकास सिंह",
      excerpt: "गुलाबी सुंडी कपास किसानों के लिए एक लगातार खतरा है। अपनी उच्च मूल्य वाली फसल को बचाने के लिए फेरोमोन जाल से लेकर समय पर कीटनाशक के प्रयोग तक एकीकृत कीट प्रबंधन (IPM) रणनीतियों की खोज करें।"
    }
  },
  {
    id: 2,
    image: "/images/crops/rice.jpg",
    link: "https://agricoop.nic.in/",
    en: {
      title: "Rice Blast Disease: Prevention Strategies for Paddy Farmers",
      category: "Rice Disease",
      date: "May 05, 2026",
      readTime: "8 min read",
      author: "Anita Sharma",
      excerpt: "Rice blast affects all parts of the plant above ground. This comprehensive guide covers water management techniques and resistant varieties to safeguard your paddy harvest."
    },
    hi: {
      title: "धान झुलसा रोग: धान किसानों के लिए रोकथाम रणनीतियाँ",
      category: "धान के रोग",
      date: "05 मई, 2026",
      readTime: "8 मिनट पढ़ें",
      author: "अनीता शर्मा",
      excerpt: "धान का झुलसा रोग पौधे के ऊपरी सभी हिस्सों को प्रभावित करता है। यह व्यापक मार्गदर्शिका आपकी धान की फसल को सुरक्षित रखने के लिए जल प्रबंधन तकनीकों और प्रतिरोधी किस्मों को शामिल करती है।"
    }
  },
  {
    id: 3,
    image: "/images/crops/maize.jpg",
    link: "https://farmer.gov.in/",
    en: {
      title: "Maize Cultivation: Managing Fall Armyworm",
      category: "Maize Info",
      date: "May 01, 2026",
      readTime: "6 min read",
      author: "Dr. Rajesh Kumar",
      excerpt: "The Fall Armyworm can decimate a maize field in days. Learn how to identify early signs of infestation and apply bio-pesticides safely and effectively."
    },
    hi: {
      title: "मक्का की खेती: फॉल आर्मीवर्म का प्रबंधन",
      category: "मक्का की जानकारी",
      date: "01 मई, 2026",
      readTime: "6 मिनट पढ़ें",
      author: "डॉ. राजेश कुमार",
      excerpt: "फॉल आर्मीवर्म कुछ ही दिनों में मक्के के खेत को नष्ट कर सकता है। संक्रमण के शुरुआती लक्षणों को पहचानना और जैव-कीटनाशकों को सुरक्षित और प्रभावी ढंग से लागू करना सीखें।"
    }
  },
  {
    id: 4,
    image: "/images/crops/papaya.jpg",
    link: "https://nhb.gov.in/",
    en: {
      title: "Papaya Ring Spot Virus: Symptoms and Protection",
      category: "Papaya Disease",
      date: "April 28, 2026",
      readTime: "4 min read",
      author: "Manoj Yadav",
      excerpt: "Transmitted by aphids, this virus causes severe mottling and distortion of leaves. Explore netting solutions, vector control, and cross-protection to protect your yield."
    },
    hi: {
      title: "पपीता रिंग स्पॉट वायरस: लक्षण और बचाव",
      category: "पपीता के रोग",
      date: "28 अप्रैल, 2026",
      readTime: "4 मिनट पढ़ें",
      author: "मनोज यादव",
      excerpt: "एफिड्स द्वारा फैलने वाला यह वायरस पत्तियों में गंभीर विकृति का कारण बनता है। अपनी उपज की रक्षा के लिए जालीदार समाधान, वेक्टर नियंत्रण और क्रॉस-प्रोटेक्शन का अन्वेषण करें।"
    }
  },
  {
    id: 5,
    image: "/images/crops/mango.jpg",
    link: "https://www.india.gov.in/topics/agriculture",
    en: {
      title: "Mango Orchard Management: Preventing Powdery Mildew",
      category: "Mango Info",
      date: "April 20, 2026",
      readTime: "7 min read",
      author: "Sunita Reddy",
      excerpt: "Powdery mildew thrives in dry, warm weather and attacks young mango blossoms. Learn about sulfur dusting techniques and pruning methods for better canopy aeration."
    },
    hi: {
      title: "आम बाग प्रबंधन: चूर्णिल आसिता से बचाव",
      category: "आम की जानकारी",
      date: "20 अप्रैल, 2026",
      readTime: "7 मिनट पढ़ें",
      author: "सुनीता रेड्डी",
      excerpt: "चूर्णिल आसिता शुष्क, गर्म मौसम में पनपता है और युवा आम के बौर पर हमला करता है। बेहतर वातन के लिए सल्फर डस्टिंग तकनीक और छंटाई के तरीकों के बारे में जानें।"
    }
  },
  {
    id: 6,
    image: "/images/crops/watermelon.jpg",
    link: "https://pmksy.gov.in/",
    en: {
      title: "Watermelon Wilt: Saving Your Summer Crop",
      category: "Watermelon Info",
      date: "April 15, 2026",
      readTime: "5 min read",
      author: "Priya Patel",
      excerpt: "Fusarium wilt can destroy watermelon vines just as the fruit ripens. Discover the importance of crop rotation, solarization, and selecting resistant hybrid seeds."
    },
    hi: {
      title: "तरबूज विल्ट (सूखा रोग): अपनी ग्रीष्मकालीन फसल को बचाना",
      category: "तरबूज की जानकारी",
      date: "15 अप्रैल, 2026",
      readTime: "5 मिनट पढ़ें",
      author: "प्रिया पटेल",
      excerpt: "फ्यूजेरियम विल्ट तरबूज की बेलों को नष्ट कर सकता है जैसे ही फल पकता है। फसल चक्र, सौरकरण और प्रतिरोधी संकर बीजों के चयन के महत्व की खोज करें।"
    }
  },
  {
    id: 7,
    image: "/images/crops/coffee.jpg",
    link: "https://www.indiacoffee.org/",
    en: {
      title: "Coffee Berry Disease: Identifying and Controlling Outbreaks",
      category: "Coffee Disease",
      date: "April 10, 2026",
      readTime: "6 min read",
      author: "Dr. Rajesh Kumar",
      excerpt: "A devastating fungal disease that attacks green coffee berries, leading to massive losses. We outline the most effective fungicidal spray schedules and cultural controls."
    },
    hi: {
      title: "कॉफी बेरी रोग: प्रकोप की पहचान और नियंत्रण",
      category: "कॉफी के रोग",
      date: "10 अप्रैल, 2026",
      readTime: "6 मिनट पढ़ें",
      author: "डॉ. राजेश कुमार",
      excerpt: "एक विनाशकारी फंगल रोग जो हरी कॉफी बेरीज पर हमला करता है, जिससे भारी नुकसान होता है। हम सबसे प्रभावी कवकनाशी स्प्रे कार्यक्रम और सांस्कृतिक नियंत्रण की रूपरेखा तैयार करते हैं।"
    }
  },
  {
    id: 8,
    image: "/images/crops/jute.jpg",
    link: "https://farmer.gov.in/",
    en: {
      title: "Jute Cultivation: Dealing with Stem Rot",
      category: "Jute Info",
      date: "April 02, 2026",
      readTime: "5 min read",
      author: "Anita Sharma",
      excerpt: "Stem rot is the most serious disease affecting jute. Learn how deep ploughing, seed treatment with fungicides, and proper weed management can save your golden fiber."
    },
    hi: {
      title: "जूट की खेती: तना सड़न (Stem Rot) से निपटना",
      category: "जूट की जानकारी",
      date: "02 अप्रैल, 2026",
      readTime: "5 मिनट पढ़ें",
      author: "अनीता शर्मा",
      excerpt: "तना सड़न जूट को प्रभावित करने वाली सबसे गंभीर बीमारी है। जानें कि गहरी जुताई, कवकनाशियों से बीज उपचार और उचित खरपतवार प्रबंधन आपके सुनहरे रेशे को कैसे बचा सकते हैं।"
    }
  }
];

const uiContent = {
  en: {
    hub: "Knowledge Hub",
    titleMain: "KrishiDisha ",
    titleHighlight: "Insights",
    subtitle: "Discover professional strategies, modern techniques, and expert advice to elevate your farming yield.",
    readArticle: "Read Article →",
    by: "By",
    categories: ["All", "Cotton Info", "Rice Disease", "Maize Info", "Papaya Disease", "Mango Info", "Watermelon Info", "Coffee Disease", "Jute Info"]
  },
  hi: {
    hub: "ज्ञान केंद्र",
    titleMain: "कृषिदिशा ",
    titleHighlight: "अंतर्दृष्टि",
    subtitle: "अपनी खेती की उपज बढ़ाने के लिए पेशेवर रणनीतियों, आधुनिक तकनीकों और विशेषज्ञ सलाह की खोज करें।",
    readArticle: "लेख पढ़ें →",
    by: "द्वारा",
    categories: ["सभी", "कपास की जानकारी", "धान के रोग", "मक्का की जानकारी", "पपीता के रोग", "आम की जानकारी", "तरबूज की जानकारी", "कॉफी के रोग", "जूट की जानकारी"]
  }
};

export default function BlogPage() {
  const { i18n } = useTranslation();
  const [filterIndex, setFilterIndex] = useState(0);

  // Fallback to 'en' if the current language is not strictly 'hi'
  const language = i18n.language === 'hi' ? 'hi' : 'en';
  const t = uiContent[language];

  // Map data to current language
  const localizedBlogs = blogsData.map(blog => ({
    id: blog.id,
    image: blog.image,
    link: blog.link,
    ...blog[language]
  }));

  const selectedCategory = t.categories[filterIndex];

  const filteredBlogs = filterIndex === 0 
    ? localizedBlogs 
    : localizedBlogs.filter(b => b.category === selectedCategory);

  return (
    <>
      <Header />
      <div className="blog-page">
        {/* Background Decorative Elements */}
        <div className="blog-glow-1"></div>
        <div className="blog-glow-2"></div>

        <div className="blog-hero">
          <span className="blog-hero-badge">{t.hub}</span>
          <h1 className="blog-title">{t.titleMain}<span className="highlight">{t.titleHighlight}</span></h1>
          <p className="blog-subtitle">{t.subtitle}</p>
        </div>

        <div className="blog-filter-container">
          {t.categories.map((cat, index) => (
            <button 
              key={index} 
              className={`filter-btn ${filterIndex === index ? "active" : ""}`}
              onClick={() => setFilterIndex(index)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="blog-list-container">
          {filteredBlogs.map(blog => (
            <article key={blog.id} className="blog-seamless-item">
              <div className="blog-seamless-image">
                <img src={blog.image} alt={blog.title} />
              </div>
              
              <div className="blog-seamless-content">
                <div className="blog-meta">
                  <span className="blog-category-text">{blog.category}</span>
                  <span className="blog-read-time">· {blog.readTime}</span>
                  <span className="blog-date">· {blog.date}</span>
                </div>
                
                <h2 className="blog-seamless-title">{blog.title}</h2>
                <p className="blog-seamless-excerpt">{blog.excerpt}</p>
                
                <div className="blog-seamless-footer">
                  <span className="author-name-text">{t.by} {blog.author}</span>
                  <a href={blog.link} target="_blank" rel="noopener noreferrer" className="blog-read-more-link">
                    {t.readArticle}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
