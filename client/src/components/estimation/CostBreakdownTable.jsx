import { formatCurrency } from '../../utils/formatCurrency';

const CostBreakdownTable = ({ calculation, selectedFeatures }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-navy-900 text-white">
            <th className="text-left py-3 px-4 text-sm font-medium rounded-tl-xl">Item</th>
            <th className="text-right py-3 px-4 text-sm font-medium">Hours</th>
            <th className="text-right py-3 px-4 text-sm font-medium">Rate</th>
            <th className="text-right py-3 px-4 text-sm font-medium rounded-tr-xl">Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100 bg-gray-50">
            <td className="py-3 px-4 text-sm font-medium text-navy-800">Base Project Setup</td>
            <td className="py-3 px-4 text-sm text-right text-gray-600">{calculation.baseHours}</td>
            <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(calculation.hourlyRate)}/hr</td>
            <td className="py-3 px-4 text-sm text-right font-medium text-navy-800">{formatCurrency(calculation.baseCost)}</td>
          </tr>
          {selectedFeatures?.map((f, i) => (
            <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <td className="py-3 px-4 text-sm text-gray-700">{f.name}</td>
              <td className="py-3 px-4 text-sm text-right text-gray-600">{f.hours}</td>
              <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(calculation.hourlyRate)}/hr</td>
              <td className="py-3 px-4 text-sm text-right font-medium text-gray-700">{formatCurrency(f.cost)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-b border-gray-200">
            <td colSpan="3" className="py-3 px-4 text-sm text-right text-gray-600">Subtotal (before complexity)</td>
            <td className="py-3 px-4 text-sm text-right font-medium">{formatCurrency(calculation.baseCost + calculation.featureCost)}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td colSpan="3" className="py-3 px-4 text-sm text-right text-gray-600">Complexity Multiplier (×{calculation.complexityMultiplier})</td>
            <td className="py-3 px-4 text-sm text-right font-medium">{formatCurrency(calculation.subtotal)}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td colSpan="3" className="py-3 px-4 text-sm text-right text-gray-600">Tax ({(calculation.taxRate * 100).toFixed(0)}%)</td>
            <td className="py-3 px-4 text-sm text-right font-medium">{formatCurrency(calculation.taxAmount)}</td>
          </tr>
          <tr className="bg-indigo-500 text-white">
            <td colSpan="3" className="py-4 px-4 text-sm font-bold text-right rounded-bl-xl">Total Cost</td>
            <td className="py-4 px-4 text-lg font-bold text-right rounded-br-xl">{formatCurrency(calculation.totalCost)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default CostBreakdownTable;
