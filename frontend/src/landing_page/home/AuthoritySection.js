function AuthoritySection() {
  return (
    <div className="authority-section py-5">
      <div className="container">

        <div className="text-center mb-5">
          <h2 className="section-title">Our Leadership</h2>
          <p className="section-subtitle">
            Guiding Warana Milk towards excellence and innovation.
          </p>
        </div>

        <div className="row">

          {/* Card 1 */}
          <div className="col-md-4 mb-4">
            <div className="authority-card text-center">
              <img 
                src="/media/images/Founder.jpg" 
                alt="Founder"
                className="authority-img"
              />
              <h5 className="mt-3">Late shri Tatyasaheb Kore</h5>
              <p className="designation">Founder</p>
              <p className="description">
               The visionary leader initiated the “Warana” movement with a dream of building a stronger India, where every farmer is self-sufficient, financially secure, well-educated, and content, recognizing that farmers are the true backbone of the national economy. He firmly believed that the prosperity and well-being of farmers directly determine the welfare and progress of the nation.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-md-4 mb-4">
            <div className="authority-card text-center">
              <img 
                src="/media/images/Chairman.jpg" 
                alt="Chairman"
                className="authority-img"
              />
              <h5 className="mt-3">Dr.Vinayraoji Kore</h5>
              <p className="designation">Chairman</p>
              <p className="description">
                The success story of Warana continues under the dynamic leadership of Shri Vinay Kore, the grandson of Late Shri Tatyasaheb Kore, who carries forward the rich legacy with vision, optimism, and dedication. With a strong commitment to agro-industrial, educational, and cultural development across Maharashtra, he believes that since 70% of the Indian economy depends on agriculture, the true path to national progress lies in combining agriculture with modern technology; at Warana, he strives tirelessly to achieve this meaningful blend and drive sustainable growth for the future.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-md-4 mb-4">
            <div className="authority-card text-center">
              <img 
                src="/media/images/Managing Director.jpg" 
                alt="Managing Director"
                className="authority-img"
              />
              <h5 className="mt-3">Mr.Sudhir Kamerikar</h5>
              <p className="designation">Managing Director</p>
              <p className="description">
              He is a dynamic administrator dedicated to enhancing the efficiency and productivity of the dairy sector. With a strong operational vision, he emphasizes expanding outreach and strengthening infrastructure, stating that Warana reaches every corner of Maharashtra and parts of Karnataka for milk collection through its extensive network of chilling plants and bulk milk coolers, ensuring quality and reliability at every step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthoritySection;