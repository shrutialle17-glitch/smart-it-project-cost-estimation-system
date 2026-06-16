const categoryColors = { frontend: 'bg-blue-100 text-blue-700', backend: 'bg-purple-100 text-purple-700', database: 'bg-green-100 text-green-700', mobile: 'bg-orange-100 text-orange-700', devops: 'bg-cyan-100 text-cyan-700' };

const TechStackBadges = ({ techStack }) => {
  if (!techStack) return null;
  const categories = Object.entries(techStack).filter(([_, items]) => Array.isArray(items) && items.length > 0);
  if (categories.length === 0) return <p className="text-sm text-gray-500">No tech stack recommendations available.</p>;

  return (
    <div className="space-y-4">
      {categories.map(([category, items]) => (
        <div key={category}>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{category}</h4>
          <div className="flex flex-wrap gap-2">
            {items.map((item, i) => (
              <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-700'}`}>{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechStackBadges;
