# FreshTrack

## Inspiration
Food waste is one of the largest contributors to environmental degradation, with millions of tons of edible food ending up in landfills each year. Inspired by the need to combat this issue, we set out to create a solution that not only reduces food waste but also fosters community sharing and sustainability.

## What it does
FreshTrack empowers users to track their food inventory, reduce waste through automated expiration alerts, and share surplus food via a community fridge system. Leveraging AI-powered receipt scanning for automatic food entry, FreshTrack makes it easy for users to keep their food inventory updated while promoting community-driven sustainability.

## How we built it
We built FreshTrack using **TypeScript** and **React Native** to ensure a fast, responsive, and cross-platform user interface. For the backend, we utilized **Supabase** for real-time data synchronization and to manage user authentication, communities, and food inventory. Our AI-powered receipt scanning leverages a pre-trained OCR API, integrated with custom parsing logic to extract food items and expiration data automatically. The system was designed with scalability in mind, optimizing database queries and ensuring smooth data flows between the frontend and backend. Through multiple iterations, we refined the architecture to support features like inventory categorization, community management, and seamless UI updates. **Gemini** was also used to power recipe suggestions, promoting the **use of ingredients and reducing food waste effectively**.

## Challenges we ran into
One of the biggest challenges was integrating the receipt scanning API and fine-tuning it to ensure accurate extraction of food items and expiration dates from a variety of receipt formats. Another significant challenge was designing an intuitive user interface that could accommodate both individual and community-focused features while maintaining simplicity and ease of use.

## Accomplishments that we're proud of
We are particularly proud of implementing the AI-powered receipt scanning feature, which simplifies food entry for users. Additionally, we successfully built a platform that not only tracks individual food inventories but also promotes community sharing through the community fridge system—an integration we believe will have a meaningful environmental and social impact.

## What we learned
Through this project, we deepened our knowledge of integrating AI technologies, such as OCR, into practical applications to automate manual processes. We also gained experience in designing and optimizing databases to handle complex relationships between users, food inventories, and community fridges. Moreover, we learned how to balance scalability with performance and deliver an intuitive, user-friendly application. This was also our first time using React Native for a project, which provided valuable hands-on experience with the framework.

## What's next for FreshTrack
Our next steps include partnering with grocery stores to directly integrate inventory data into the platform, eliminating the need for manual entry or scanning. We also plan to expand the community fridge network, enabling more users to participate in food sharing. By streamlining food management and fostering collaboration, FreshTrack aims to make food waste reduction effortless and impactful.
