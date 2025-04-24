import { useState, useCallback } from 'react';
import { api } from '@/modules/patterns/api';
import { eventBus } from '@/modules/core/events';
import { events } from '@/modules/patterns/events';

export const usePatternsState = () => {
  const [patterns, setPatterns] = useState([]);
  const [generatedPattern, setGeneratedPattern] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const loadPatterns = useCallback(async (type = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const patternsData = await api.getPatterns(type);
      setPatterns(patternsData);
      return patternsData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const generatePattern = useCallback(async (generationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.generatePattern(generationData);
      setGeneratedPattern(result);
      
      // Publish event
      eventBus.publish(events.PATTERN_GENERATED, { 
        pattern: result.pattern,
        customer: result.customer,
        measurements: result.measurements,
        generation: {
          id: result.id,
          pdfUrl: result.pdfUrl
        }
      });
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    patterns,
    generatedPattern,
    loading,
    error,
    loadPatterns,
    generatePattern
  };
};