import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { Upload, Camera, Loader2, ArrowRight, Save, DollarSign, FileText } from 'lucide-react';

export default function ExpenseForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currencyRates, setCurrencyRates] = useState({ USD: 1 });
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    category: 'other',
    expense_date: new Date().toISOString().split('T')[0],
    description: '',
    receipt_url: '',
    ocr_data: null
  });

  // Fetch live currency rates (using free api or mock for hackathon)
  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Fallback or cached logic
        const cachedStr = localStorage.getItem('currency_rates');
        const cachedTime = localStorage.getItem('currency_rates_time');
        
        // Use cache if less than 1 hour old
        if (cachedStr && cachedTime && (Date.now() - parseInt(cachedTime)) < 3600000) {
          setCurrencyRates(JSON.parse(cachedStr));
          return;
        }

        // Fetching live data (mocked free endpoint for simplicity, replace with real API)
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data && data.rates) {
          setCurrencyRates(data.rates);
          localStorage.setItem('currency_rates', JSON.stringify(data.rates));
          localStorage.setItem('currency_rates_time', Date.now().toString());
        }
      } catch (err) {
        console.error('Failed to fetch rates, using fallback', err);
      }
    };
    fetchRates();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateConverted = () => {
    if (!formData.amount) return '0.00';
    const rate = currencyRates[formData.currency] || 1;
    // Base amount is USD. So if currency is EUR, rate is 0.9. Amount / 0.9 = USD
    const usdAmount = parseFloat(formData.amount) / rate;
    return usdAmount.toFixed(2);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formPayload = new FormData();
    formPayload.append('receipt', file);

    try {
      const res = await api.post('/expenses/ocr', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const { extracted_amount, extracted_date, receipt_url } = res.data.data;
      
      setFormData(prev => ({
        ...prev,
        amount: extracted_amount || prev.amount,
        expense_date: extracted_date ? new Date(extracted_date).toISOString().split('T')[0] : prev.expense_date,
        receipt_url,
        ocr_data: res.data.data
      }));
      
      toast.success('Receipt scanned successfully!');
      setStep(2);
    } catch (err) {
      toast.error('Failed to read receipt. Please enter manually.');
      setStep(2); // Move to manual entry anyway
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        converted_amount: calculateConverted()
      };
      
      await api.post('/expenses', payload);
      toast.success('Expense saved as draft!');
      navigate('/expenses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300 ${step === 1 ? 'w-0' : 'w-full'}`}></div>
          
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 ${step >= 1 ? 'bg-primary border-primary/20 text-white shadow-lg' : 'bg-white border-gray-200 text-gray-400'}`}>1</div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-all ${step >= 2 ? 'bg-primary border-primary/20 text-white shadow-lg delay-150' : 'bg-white border-gray-200 text-gray-400'}`}>2</div>
        </div>
        <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
          <span>Upload Receipt</span>
          <span>Fill Details</span>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
        
        {step === 1 ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload your receipt</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Upload an image of your receipt and our AI will automatically extract the details for you.</p>
            
            <div className="flex flex-col items-center gap-4">
              <label className={`relative flex items-center justify-center px-8 py-4 bg-primary text-white rounded-xl font-medium shadow-lg hover:bg-indigo-700 hover:shadow-primary/30 transition-all cursor-pointer overflow-hidden ${loading ? 'opacity-80 pointer-events-none' : ''}`}>
                {loading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Scanning...</>
                ) : (
                  <><Upload className="w-5 h-5 mr-2" /> Select Image</>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={loading} />
              </label>
              
              <button 
                onClick={() => setStep(2)} 
                className="text-gray-500 hover:text-gray-900 font-medium text-sm mt-4 px-4 py-2"
                disabled={loading}
              >
                Skip and enter manually
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Expense Details</h2>
              <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-primary hover:text-indigo-800">
                &larr; Back
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center"><FileText className="w-4 h-4 mr-1 text-gray-400"/> Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400" placeholder="e.g. Client Dinner" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white">
                  <option value="travel">Travel</option>
                  <option value="meals">Meals</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="office_supplies">Office Supplies</option>
                  <option value="training">Training</option>
                  <option value="equipment">Equipment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center"><DollarSign className="w-4 h-4 mr-1 text-gray-400"/> Amount & Currency</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input required type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="0.00" />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      {(formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : formData.currency === 'GBP' ? '£' : '')}
                    </span>
                  </div>
                  <select name="currency" value={formData.currency} onChange={handleChange} className="w-32 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-medium">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
                {formData.amount && (
                  <p className="text-xs text-gray-500 mt-1 flex justify-end">
                    Converted: <strong className="text-gray-700 ml-1">USD {calculateConverted()}</strong>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Expense Date</label>
                <input required type="date" name="expense_date" value={formData.expense_date} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Description (Optional)</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400 resize-none" placeholder="Provide any additional context..."></textarea>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => navigate('/expenses')} className="px-6 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-all">Cancel</button>
              <button type="submit" disabled={loading} className={`px-6 py-2.5 bg-primary text-white rounded-xl font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center ${loading ? 'opacity-70 pointer-events-none' : ''}`}>
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                Save Draft
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
