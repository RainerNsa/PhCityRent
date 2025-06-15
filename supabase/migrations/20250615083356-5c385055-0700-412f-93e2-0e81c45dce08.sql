
-- Add notification tracking table for automated WhatsApp notifications
CREATE TABLE public.notification_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.agent_applications(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL, -- 'status_update', 'referee_contact', 'welcome', 'document_request'
    recipient_type TEXT NOT NULL, -- 'applicant', 'referee', 'admin'
    recipient_number TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'delivered'
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add admin performance tracking table
CREATE TABLE public.admin_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL, -- 'applications_reviewed', 'average_review_time', 'approval_rate'
    metric_value NUMERIC NOT NULL,
    metric_date DATE DEFAULT CURRENT_DATE,
    additional_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add bulk operations log table
CREATE TABLE public.bulk_operations_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    operation_type TEXT NOT NULL, -- 'bulk_approve', 'bulk_reject', 'bulk_contact_referees'
    application_ids UUID[] NOT NULL,
    operation_data JSONB,
    status TEXT DEFAULT 'in_progress',
    completed_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    error_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Add document validation tracking
CREATE TABLE public.document_validation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.verification_documents(id) ON DELETE CASCADE,
    validation_type TEXT NOT NULL, -- 'format_check', 'quality_check', 'content_verification'
    validation_status TEXT NOT NULL, -- 'passed', 'failed', 'needs_review'
    confidence_score NUMERIC,
    validation_details JSONB,
    validated_by UUID REFERENCES auth.users(id),
    validated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_operations_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_validation ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Admins can manage notification log" ON public.notification_log
    FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can manage performance data" ON public.admin_performance
    FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can manage bulk operations" ON public.bulk_operations_log
    FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can manage document validation" ON public.document_validation
    FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Add function to calculate admin performance metrics
CREATE OR REPLACE FUNCTION public.calculate_admin_metrics(admin_user_id UUID, metric_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    applications_reviewed BIGINT,
    average_review_time_hours NUMERIC,
    approval_rate NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH admin_stats AS (
        SELECT 
            COUNT(*) as total_reviewed,
            AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_hours,
            COUNT(*) FILTER (WHERE status = 'approved') as approved_count
        FROM public.agent_applications aa
        JOIN public.verification_status_log vsl ON aa.id = vsl.application_id
        WHERE vsl.changed_by = admin_user_id
        AND DATE(vsl.created_at) = metric_date
    )
    SELECT 
        total_reviewed,
        ROUND(avg_hours, 2),
        CASE 
            WHEN total_reviewed > 0 THEN ROUND((approved_count::NUMERIC / total_reviewed::NUMERIC) * 100, 2)
            ELSE 0
        END
    FROM admin_stats;
END;
$$;

-- Add trigger to update admin performance metrics
CREATE OR REPLACE FUNCTION public.update_admin_performance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update performance metrics when status changes
    IF NEW.changed_by IS NOT NULL THEN
        INSERT INTO public.admin_performance (admin_id, metric_name, metric_value, additional_data)
        SELECT 
            NEW.changed_by,
            'status_change',
            1,
            jsonb_build_object(
                'application_id', NEW.application_id,
                'previous_status', OLD.previous_status,
                'new_status', NEW.new_status,
                'change_date', NEW.created_at
            );
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER admin_performance_trigger
    AFTER INSERT ON public.verification_status_log
    FOR EACH ROW
    EXECUTE FUNCTION public.update_admin_performance();

-- Add indexes for better performance
CREATE INDEX idx_notification_log_application_id ON public.notification_log(application_id);
CREATE INDEX idx_notification_log_status ON public.notification_log(status);
CREATE INDEX idx_admin_performance_admin_date ON public.admin_performance(admin_id, metric_date);
CREATE INDEX idx_bulk_operations_admin ON public.bulk_operations_log(admin_id);
CREATE INDEX idx_document_validation_document_id ON public.document_validation(document_id);
